package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.postlike.PostLikeRequestDto;
import com.climbCommunity.backend.dto.postlike.PostLikeResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.PostLike;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.PostLikeService;
import com.climbCommunity.backend.service.PostService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post-likes")
@RequiredArgsConstructor
public class PostLikeController {
    private final PostLikeService postLikeService;
    private final PostService postService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<PostLikeResponseDto> likePost(@RequestBody PostLikeRequestDto dto) {
        Post post = postService.getPostById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (postLikeService.hasUserLiked(dto.getPostId(), dto.getUserId())) {
            throw new RuntimeException("User already liked this post");
        }

        PostLike like = PostLike.builder()
                .post(post)
                .user(user)
                .build();

        PostLike savedLike = postLikeService.savePostLike(like);

        PostLikeResponseDto response = PostLikeResponseDto.builder()
                .id(savedLike.getId())
                .postId(savedLike.getPost().getId())
                .userId(savedLike.getUser().getId())
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unlikePost(@PathVariable Long id) {
        postLikeService.deletePostLike(id);
        return ResponseEntity.noContent().build();
    }
}
