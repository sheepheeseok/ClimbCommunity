package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.post.PostRequestDto;
import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.exception.NotFoundException;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.PostService;
import com.climbCommunity.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody PostRequestDto dto) {

        User user = userService.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        Post post = Post.builder()
                .user(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(dto.getCategory())
                .build();

        Post savedPost = postService.savePost(post);
        return ResponseEntity.ok(PostResponseDto.fromEntity(savedPost));
    }

    // 게시글 목록 조회 ( 카테고리별 조회 )
    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(
            @RequestParam(value = "category", required = false) Category category,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<Post> posts;
        if (category != null) {
            posts = postService.getPostsByCategory(category, pageable);
        } else {
            posts = postService.getAllPosts(pageable);
        }

        Page<PostResponseDto> response = posts.map(PostResponseDto::fromEntity);
        return ResponseEntity.ok(response);
    }

    // 게시글 단일 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postId) {
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(PostResponseDto.fromEntity(post));
    }

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDto> updatePost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long postId,
            @Valid @RequestBody PostRequestDto dto) {

        Post updatedPost = postService.updatePost(
                postId, dto.getTitle(), dto.getContent(), dto.getCategory(), userPrincipal.getUserId());
        return ResponseEntity.ok(PostResponseDto.fromEntity(updatedPost));
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long postId) {

        postService.deletePost(postId, userPrincipal.getUserId());
        return ResponseEntity.noContent().build();
    }
}
