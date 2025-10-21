package com.climbCommunity.backend.service;
import com.climbCommunity.backend.dto.post.MediaDto;
import com.climbCommunity.backend.dto.post.PostDeleteResponseDto;
import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.dto.post.PostUpdateRequestDto;
import com.climbCommunity.backend.dto.useractivity.MyPostDto;
import com.climbCommunity.backend.entity.Post;
import java.io.File;
import com.climbCommunity.backend.entity.PostImage;
import com.climbCommunity.backend.entity.PostVideo;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.entity.enums.PostStatus;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.exception.NotFoundException;
import com.climbCommunity.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.climbCommunity.backend.entity.PostTag;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.repository.PostTagRepository;
import com.climbCommunity.backend.service.NotificationService;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final S3Service s3Service;
    private final PostImageService postImageService;
    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;
    private final PostTagRepository postTagRepository;
    private final NotificationService notificationService;
    private final CommentRepository commentRepository;
    private final PostEventPublisher postEventPublisher;
    private final AsyncVideoService asyncVideoService;

    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Page<Post> getPostsByCategory(Category category, Pageable pageable){
        return postRepository.findByCategory(category, pageable);
    }

    public PostResponseDto toDto(Post post) {
        long commentCount = commentRepository.countByPost_Id(post.getId());
        long likeCount = postLikeRepository.countByPost(post);

        return PostResponseDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .category(post.getCategory())
                .username(post.getUser().getUsername())
                .userId(post.getUser().getUserId())
                .profileImage(post.getUser().getProfileImage())
                .status(post.getStatus().name())
                .createdAt(post.getCreatedAt().toString())
                .updatedAt(post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : null)
                .mediaList(
                        Stream.concat(
                                        post.getImages().stream()
                                                .map(img -> new MediaDto(
                                                        s3Service.getFileUrl(img.getImageUrl()), "image", img.getOrderIndex())),
                                        post.getVideos().stream()
                                                .map(video -> new MediaDto(
                                                        s3Service.getFileUrl(video.getVideoUrl()),"video", video.getOrderIndex()))
                                )
                                .sorted(Comparator.comparingInt(MediaDto::getOrderIndex)) // ✅ orderIndex 순 정렬
                                .toList()
                )
                .thumbnailUrl(post.getThumbnailUrl())   // ✅ 썸네일
                .location(post.getLocation())           // ✅ location 매핑
                .completedProblems(post.getCompletedProblems()) // ✅ 완등 문제 매핑
                .commentCount(commentCount)
                .likeCount(likeCount)

                .taggedUsers(
                        post.getTags().stream()
                                .map(tag -> new com.climbCommunity.backend.dto.post.TaggedUserDto(
                                        tag.getTaggedUser().getUserId(),
                                        tag.getTaggedUser().getUsername(),
                                        tag.getTaggedUser().getProfileImage()
                                ))
                                .toList()
                )

                .build();
    }

    // 게시글 단일 조회
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));
    }

    // 게시글 수정
    public Post updatePost(Long id, String title, String content, Category category, String currentUserId) {
        Post post = getPostById(id);

        if (!post.getUser().getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("게시글 수정 권한이 없습니다.");
        }

        post.setContent(content);
        post.setCategory(category);
        return postRepository.save(post);
    }

    @Transactional
    public PostDeleteResponseDto deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("게시글 삭제 권한이 없습니다.");
        }

        postLikeRepository.deleteByPost(post);

        commentRepository.deleteByPost(post);
        // ✅ DB 삭제 (cascade로 연관 엔티티 자동 삭제)
        postRepository.delete(post);

        // ✅ S3 삭제
        try {
            s3Service.deletePostFolder(userId, postId);  // userId 포함해야 prefix가 정확함
        } catch (Exception e) {
            log.warn("⚠️ S3 파일 삭제 중 예외 발생 (무시): postId={}", postId, e);
        }

        return new PostDeleteResponseDto(postId, "게시글이 성공적으로 삭제되었습니다.");
    }


    // 관리자 게시글 상태 변경
    public void adminUpdatePostStatus(Long postId, PostStatus status) {
        Post post = getPostById(postId);
        post.setStatus(status);
        postRepository.save(post);
    }

    // 관리자 게시글 강제 삭제
    public void adminDeletePost(Long postId) {
        Post post = getPostById(postId);
        postRepository.delete(post);
    }

    public List<MyPostDto> getMyPosts(Long userId) {
        return postRepository.findByUserId(userId).stream()
                .map(post -> MyPostDto.builder()
                        .postId(post.getId())
                        .category(post.getCategory().name())
                        .createdAt(post.getCreatedAt().toString())
                        .build())
                .toList();
    }

    public int countByUser(Long userId) {
        return postRepository.countByUser_Id(userId);
    }

    @Transactional
    public Post savePostWithMedia(Post post,
                                  List<MultipartFile> files,
                                  List<MultipartFile> thumbnails,
                                  Integer thumbnailIndex) {

        Post savedPost = postRepository.save(post);
        Long postId = savedPost.getId();
        Long userId = savedPost.getUser().getId();

        log.info("📌 [savePostWithMedia] postId={}, userId={}, thumbnailIndex={}", postId, userId, thumbnailIndex);

        if (files != null && !files.isEmpty()) {
            String mediaDir = "posts/" + postId + "/media";
            int order = 0;

            for (MultipartFile file : files) {
                try {
                    String contentType = file.getContentType();
                    String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";

                    // ✅ 비디오 여부 판별 (contentType 우선, 확장자 보조)
                    boolean isVideo = false;
                    if (contentType != null) {
                        isVideo = contentType.startsWith("video");
                    }
                    if (!isVideo && !originalName.isBlank()) {
                        isVideo = originalName.endsWith(".mp4")
                                || originalName.endsWith(".mov")
                                || originalName.endsWith(".mkv");
                    }

                    if (isVideo) {
                        log.info("🎬 비디오 업로드 처리: {}", originalName);
                        File tempFile = File.createTempFile("upload-", ".mp4");
                        file.transferTo(tempFile);

                        // ✅ 비동기 변환 시작
                        asyncVideoService.processVideoAsync(postId, tempFile, userId, mediaDir, order, savedPost);

                    } else {
                        log.info("🖼️ 이미지 업로드 처리: {}", originalName);
                        String imageDir = "posts/" + postId + "/images";
                        String key = s3Service.uploadFile(file, userId, imageDir);

                        PostImage postImage = PostImage.builder()
                                .post(savedPost)
                                .imageUrl(key)
                                .type("image")
                                .orderIndex(order)
                                .build();
                        postImageService.save(postImage);
                    }
                } catch (Exception e) {
                    log.error("❌ 파일 업로드 실패: {}", file.getOriginalFilename(), e);
                }
                order++;
            }
        }

        // === 썸네일 업로드 ===
        if (thumbnails != null && !thumbnails.isEmpty()) {
            String thumbDir = "posts/" + postId + "/thumbnails";
            for (int i = 0; i < thumbnails.size(); i++) {
                MultipartFile thumb = thumbnails.get(i);
                try {
                    String key = s3Service.uploadFile(thumb, userId, thumbDir);
                    if (thumbnailIndex != null && i == thumbnailIndex) {
                        savedPost.setThumbnailUrl(key);
                    }
                } catch (Exception e) {
                    log.error("❌ 썸네일 업로드 실패: {}", thumb.getOriginalFilename(), e);
                }
            }
        }

        // === fallback: 썸네일 지정 ===
        if (savedPost.getThumbnailUrl() == null) {
            if (!savedPost.getImages().isEmpty()) {
                savedPost.setThumbnailUrl(savedPost.getImages().get(0).getImageUrl());
            } else if (!savedPost.getVideos().isEmpty()) {
                savedPost.setThumbnailUrl(savedPost.getVideos().get(0).getVideoUrl());
            }
        }

        Post finalPost = postRepository.save(savedPost);

        // 이벤트 발행
        postEventPublisher.publishPostCreated(finalPost);

        return finalPost;
    }


    @Transactional
    public void savePostTags(Post post, List<String> taggedUsers) {
        if (taggedUsers == null || taggedUsers.isEmpty()) return;

        for (String taggedUserId : taggedUsers) {
            User taggedUser = userRepository.findByUserId(taggedUserId)
                    .orElseThrow(() -> new NotFoundException("태그된 사용자 없음: " + taggedUserId));

            // 이미 동일한 태그가 존재하는지 체크 (중복 방지)
            boolean exists = postTagRepository.existsByPostAndTaggedUser(post, taggedUser);
            if (exists) continue;

            // ✅ 태그 저장
            PostTag tag = PostTag.builder()
                    .post(post)
                    .taggedUser(taggedUser)
                    .build();
            postTagRepository.save(tag);

            // ✅ 태그된 사용자에게 알림 전송 (선택)
            notificationService.createNotification(
                    taggedUser.getId(),            // ✅ recipientUserId (알림 받는 사람)
                    post.getUser().getId(),        // ✅ actorUserId (알림 보낸 사람)
                    NotificationType.TAGGED,
                    TargetType.POST,
                    post.getId(), "님이 게시물에 당신을 태그했습니다."
            );
        }
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> getTaggedPosts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        List<PostTag> postTags = postTagRepository.findByTaggedUser(user);

        return postTags.stream()
                .map(pt -> postRepository.findByIdWithMedia(pt.getPost().getId())
                        .map(post -> PostResponseDto.fromEntityWithS3(post, s3Service))
                        .orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    @Transactional
    public PostResponseDto updatePost(Long postId, Long userId, PostUpdateRequestDto dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new SecurityException("게시글 수정 권한이 없습니다.");
        }

        if (dto.getContent() != null) {
            post.setContent(dto.getContent());
        }
        if (dto.getLocation() != null) {
            post.setLocation(dto.getLocation());
        }
        if (dto.getCompletedProblems() != null) {
            post.setCompletedProblems(dto.getCompletedProblems());
        }

        Post saved = postRepository.save(post);
        return toDto(saved);
    }


}
