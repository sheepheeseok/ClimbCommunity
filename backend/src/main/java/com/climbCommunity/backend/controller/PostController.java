package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.post.PostRequestDto;
import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.PostService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@RequestBody PostRequestDto dto) {
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = Post.builder()
                .user(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .build();

        Post savedPost = postService.savePost(post);

        PostResponseDto response = PostResponseDto.builder()
                .id(savedPost.getId())
                .title(savedPost.getTitle())
                .content(savedPost.getContent())
                .username(savedPost.getUser().getUsername())
                .createdAt(savedPost.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .updatedAt(savedPost.getUpdatedAt() != null ? savedPost.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        List<PostResponseDto> posts = postService.getAllPosts().stream()
                .map(post -> PostResponseDto.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .username(post.getUser().getUsername())
                        .createdAt(post.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                        .updatedAt(post.getUpdatedAt() != null ? post.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(posts);
    }
}
