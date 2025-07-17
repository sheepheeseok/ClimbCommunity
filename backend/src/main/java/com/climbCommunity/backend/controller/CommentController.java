package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.comment.CommentRequestDto;
import com.climbCommunity.backend.dto.comment.CommentResponseDto;
import com.climbCommunity.backend.entity.Comment;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.CommentService;
import com.climbCommunity.backend.service.PostService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final PostService postService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(@RequestBody CommentRequestDto dto) {
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postService.getPostById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .user(user)
                .post(post)
                .content(dto.getContent())
                .parentComment(dto.getParentCommentId() != null ?
                        commentService.getCommentById(dto.getParentCommentId())
                                .orElse(null) : null)
                .build();

        Comment savedComment = commentService.saveComment(comment);

        CommentResponseDto response = CommentResponseDto.builder()
                .id(savedComment.getId())
                .content(savedComment.getContent())
                .username(user.getUsername())
                .createdAt(savedComment.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .parentCommentId(dto.getParentCommentId())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/post/{postId")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentService.getCommentsByPostId(postId).stream()
                .map(comment -> CommentResponseDto.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .username(comment.getUser().getUsername())
                        .createdAt(comment.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                        .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null )
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(comments);
    }
}
