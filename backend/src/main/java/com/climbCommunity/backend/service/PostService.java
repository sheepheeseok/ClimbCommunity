package com.climbCommunity.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.dto.useractivity.MyPostDto;
import com.climbCommunity.backend.entity.Post;
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
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final S3Service s3Service;
    private final PostImageService postImageService;
    private final PostVideoService postVideoService;
    private final AmazonS3 amazonS3;
    private final PostImageRepository postImageRepository;
    private final PostVideoRepository postVideoRepository;
    private final CommentRepository commentRepository;

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
                .status(post.getStatus().name())
                .createdAt(post.getCreatedAt().toString())
                .updatedAt(post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : null)
                .imageUrls(post.getImages().stream()
                        .map(img -> s3Service.getFileUrl(img.getImageUrl())) // ✅ 풀 URL 변환
                        .toList())
                .videoUrls(post.getVideos().stream()
                        .map(video -> s3Service.getFileUrl(video.getVideoUrl())) // ✅ 풀 URL 변환
                        .toList())
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
                                  List<MultipartFile> images,
                                  List<MultipartFile> videos,
                                  Integer thumbnailIndex) {
        Post savedPost = postRepository.save(post);
        Long postId = savedPost.getId();
        Long userId = savedPost.getUser().getId(); // 작성자 userId

        // 업로드된 파일들의 key 리스트 (썸네일 선택용)
        List<String> uploadedKeys = new ArrayList<>();

        // === 이미지 업로드 ===
        if (images != null && !images.isEmpty()) {
            String imageDir = "posts/" + postId + "/images";
            for (MultipartFile file : images) {
                String key = s3Service.uploadFile(file, userId, imageDir);
                uploadedKeys.add(key);

                PostImage postImage = PostImage.builder()
                        .post(savedPost)
                        .imageUrl(key) // DB에는 key 저장 (URL 대신)
                        .build();
                postImageService.save(postImage);
            }
        }

        // === 비디오 업로드 ===
        if (videos != null && !videos.isEmpty()) {
            String videoDir = "posts/" + postId + "/videos";
            for (MultipartFile file : videos) {
                String key = s3Service.uploadFile(file, userId, videoDir);
                uploadedKeys.add(key);

                PostVideo postVideo = PostVideo.builder()
                        .post(savedPost)
                        .videoUrl(key) // DB에는 key 저장
                        .build();
                postVideoService.save(postVideo);
            }
        }

        // === 대표 썸네일 지정 ===
        if (thumbnailIndex != null &&
                thumbnailIndex >= 0 &&
                thumbnailIndex < uploadedKeys.size()) {
            savedPost.setThumbnailUrl(uploadedKeys.get(thumbnailIndex));
        } else if (!uploadedKeys.isEmpty()) {
            // fallback: 첫 번째 업로드 파일
            savedPost.setThumbnailUrl(uploadedKeys.get(0));
        }

        return postRepository.save(savedPost);
    }


}
