package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.comment.CommentRequestDto;
import com.climbCommunity.backend.dto.comment.CommentResponseDto;
import com.climbCommunity.backend.dto.report.ReportRequestDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.LikeType;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.CommentService;
import com.climbCommunity.backend.service.NotificationService;
import com.climbCommunity.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final PostService postService;
    private final NotificationService notificationService;

    // 댓글 등록
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        CommentResponseDto response = commentService.saveComment(postId, userPrincipal.getId(), dto);
        return ResponseEntity.ok(response);
    }

    // 댓글 목록 조회 (좋아요 상태, 개수 포함)
    @GetMapping
    public ResponseEntity<Page<CommentResponseDto>> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<CommentResponseDto> comments = commentService.getCommentTreeByPostId(postId, page, size, userId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody CommentRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        CommentResponseDto response = commentService.updateComment(commentId, userPrincipal.getId(), dto, isAdmin);
        return ResponseEntity.ok(response);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        commentService.deleteComment(commentId, userPrincipal.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    // 댓글 신고
    @PostMapping("/{commentId}/report")
    public ResponseEntity<Void> reportComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody ReportRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        commentService.reportComment(commentId, userPrincipal.getId(), dto.getReason());
        return ResponseEntity.ok().build();
    }

    // 댓글 좋아요 토글
    @PostMapping("/{commentId}/like")
    public ResponseEntity<String> toggleLikeComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal.getId();

        boolean alreadyLiked = commentService.hasUserLiked(commentId, userId, LikeType.LIKE);

        if (alreadyLiked) {
            commentService.removeLike(commentId, userId, LikeType.LIKE);
            return ResponseEntity.ok("좋아요 취소");
        } else {
            commentService.addLike(commentId, userId, LikeType.LIKE);

            Post post = postService.getPostById(postId);
            if (!post.getUser().getId().equals(userId)) {
                notificationService.createNotification(
                        post.getUser().getId(),
                        userId,
                        NotificationType.LIKE,
                        TargetType.POST,
                        postId,
                        "님이 게시글을 좋아했습니다."
                );
            }
            return ResponseEntity.ok("좋아요 추가");
        }
    }

    // 댓글 좋아요 여부 확인
    @GetMapping("/{commentId}/like/check")
    public ResponseEntity<Boolean> hasLikedComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        boolean liked = commentService.hasUserLiked(commentId, userPrincipal.getId(), LikeType.LIKE);
        return ResponseEntity.ok(liked);
    }
}
