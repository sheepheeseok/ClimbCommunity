package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.PostStatus;
import com.climbCommunity.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) PostStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<PostResponseDto> response = postService.findAllPosts(keyword, status, page, size)
                .stream()
                .map(PostResponseDto::fromEntity) // Post -> PostResponseDto 변환
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(PostResponseDto.fromEntity(post));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updatePostStatus(@PathVariable Long id, @RequestParam PostStatus postStatus) {
        postService.adminUpdatePostStatus(id, postStatus);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.adminDeletePost(id);
        return ResponseEntity.noContent().build();
    }
}
