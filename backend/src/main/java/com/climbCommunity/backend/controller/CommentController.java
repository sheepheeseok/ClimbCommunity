package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.comment.CommentRequestDto;
import com.climbCommunity.backend.dto.comment.CommentResponseDto;
import com.climbCommunity.backend.dto.report.ReportRequestDto;
import com.climbCommunity.backend.entity.enums.LikeType;
import com.climbCommunity.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 등록
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        CommentResponseDto response = commentService.saveComment(postId, userId, dto);
        return ResponseEntity.ok(response);
    }

    // 댓글 목록 조회
    @GetMapping
    public ResponseEntity<Page<CommentResponseDto>> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.getCommentTreeByPostId(postId, page, size));
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody CommentRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null || userDetails.getAuthorities() == null) {
            return ResponseEntity.status(401).body(null);
        }

        String userId = userDetails.getUsername();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        CommentResponseDto response = commentService.updateComment(commentId, userId, dto, isAdmin);
        return ResponseEntity.ok(response);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        commentService.deleteComment(commentId, userId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    // 댓글 신고
    @PostMapping("/{commentId}/report")
    public ResponseEntity<Void> reportComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody ReportRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        commentService.reportComment(commentId, userId, dto.getReason());
        return ResponseEntity.ok().build();
    }

    // 좋아요 기능
    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> likeComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        commentService.toogleLike(commentId, userId, LikeType.LIKE);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{commentId}/dislike")
    public ResponseEntity<Void> dislikeComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        commentService.toogleLike(commentId, userId, LikeType.DISLIKE);
        return ResponseEntity.ok().build();
    }
}
