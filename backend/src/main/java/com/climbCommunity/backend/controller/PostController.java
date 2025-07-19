package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.post.PostRequestDto;
import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.exception.NotFoundException;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.PostService;
import com.climbCommunity.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
                .build();

        Post savedPost = postService.savePost(post);
        return ResponseEntity.ok(PostResponseDto.fromEntity(savedPost));
    }

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        List<PostResponseDto> posts = postService.getAllPosts().stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(posts);
    }

    // 게시글 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(PostResponseDto.fromEntity(post));
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> updatePost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody PostRequestDto dto) {

        Post updatedPost = postService.updatePost(
                id, dto.getTitle(), dto.getContent(), userPrincipal.getUserId());
        return ResponseEntity.ok(PostResponseDto.fromEntity(updatedPost));
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {

        postService.deletePost(id, userPrincipal.getUserId());
        return ResponseEntity.noContent().build();
    }
}
