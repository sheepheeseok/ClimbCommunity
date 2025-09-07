package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.post.PostRequestDto;
import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.PostImage;
import com.climbCommunity.backend.entity.PostVideo;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.exception.NotFoundException;
import com.climbCommunity.backend.repository.PostImageRepository;
import com.climbCommunity.backend.repository.PostVideoRepository;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final UserService userService;

    // 게시글 등록
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> createPost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestPart("post") @Valid PostRequestDto dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videoFiles) {

        User user = userService.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        Post post = Post.builder()
                .user(user)
                .content(dto.getContent())
                .category(dto.getCategory())
                .location(dto.getLocation())
                .date(dto.getDate()) // 문자열이면 파싱 필요
                .completedProblems(dto.getCompletedProblems())
                .build();

        Integer thumbnailIndex = dto.getThumbnailIndex();

        Post savedPost = postService.savePostWithMedia(post, imageFiles, videoFiles, thumbnailIndex);
        return ResponseEntity.ok(PostResponseDto.fromEntity(savedPost));
    }


    // 게시글 목록 조회 ( 카테고리별 조회 )
    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(
            @RequestParam(value = "category", required = false) Category category,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<Post> posts = (category != null)
                ? postService.getPostsByCategory(category, pageable)
                : postService.getAllPosts(pageable);

        Page<PostResponseDto> response = posts.map(postService::toDto);
        return ResponseEntity.ok(response);
    }

    // 게시글 단일 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postId) {
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(postService.toDto(post));
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long postId) {

        postService.deletePost(postId, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
