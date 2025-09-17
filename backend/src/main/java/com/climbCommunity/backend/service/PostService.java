package com.climbCommunity.backend.service;
import com.climbCommunity.backend.dto.post.MediaDto;
import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.dto.useractivity.MyPostDto;
import com.climbCommunity.backend.entity.Post;
import java.io.File;
import com.climbCommunity.backend.entity.PostImage;
import com.climbCommunity.backend.entity.PostVideo;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.entity.enums.PostStatus;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.exception.NotFoundException;
import com.climbCommunity.backend.repository.CommentRepository;
import com.climbCommunity.backend.repository.PostImageRepository;
import com.climbCommunity.backend.repository.PostRepository;
import com.climbCommunity.backend.repository.PostVideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final S3Service s3Service;
    private final PostImageService postImageService;
    private final PostVideoService postVideoService;
    private final PostImageRepository postImageRepository;
    private final PostVideoRepository postVideoRepository;
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
                                                .map(img -> new MediaDto("image", s3Service.getFileUrl(img.getImageUrl()), img.getOrderIndex())),
                                        post.getVideos().stream()
                                                .map(video -> new MediaDto("video", s3Service.getFileUrl(video.getVideoUrl()), video.getOrderIndex()))
                                )
                                .sorted(Comparator.comparingInt(MediaDto::getOrderIndex)) // ✅ orderIndex 순 정렬
                                .toList()
                )
                .thumbnailUrl(post.getThumbnailUrl())   // ✅ 썸네일
                .location(post.getLocation())           // ✅ location 매핑
                .completedProblems(post.getCompletedProblems()) // ✅ 완등 문제 매핑
                .commentCount(commentCount)
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
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("게시글 삭제 권한이 없습니다.");
        }

        // ✅ 1. 연관된 데이터 먼저 삭제
        postImageRepository.deleteByPost(post);     // post_images
        postVideoRepository.deleteByPost(post);     // post_videos
        commentRepository.deleteByPost(post);       // comments (게시글 댓글)

        // ✅ 2. 게시글 삭제
        postRepository.delete(post);

        // ✅ 3. S3 정리 (posts/{postId}/images, videos 전체 삭제)
        try {
            s3Service.deletePostFolder(postId);
        } catch (Exception e) {
            log.warn("S3 파일 삭제 중 예외 발생 (무시): postId={}", postId, e);
            // 게시글 삭제 자체는 성공으로 처리
        }
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
                        String key = s3Service.uploadFile(file, userId, mediaDir);
                        PostImage postImage = PostImage.builder()
                                .post(savedPost)
                                .imageUrl(key)
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



}
