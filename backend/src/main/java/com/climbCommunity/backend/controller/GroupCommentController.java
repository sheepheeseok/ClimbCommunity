package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.group.GroupCommentRequestDto;
import com.climbCommunity.backend.dto.group.GroupCommentResponseDto;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.GroupCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/groups/{groupId}/comments")
@RequiredArgsConstructor
public class GroupCommentController {
    private final GroupCommentService commentService;

    @PostMapping
    public ResponseEntity<Void> createComment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long groupId,
            @RequestBody GroupCommentRequestDto dto) {
        commentService.addComment(groupId, userPrincipal.getUserId(), dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<GroupCommentResponseDto>> getComments(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(commentService.getComments(groupId, userPrincipal.getUserId()));
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<Void> updateComment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long commentId,
            @RequestBody GroupCommentRequestDto dto) {
        commentService.updateComment(commentId, userPrincipal.getUserId(), dto.getContent());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long commentId) {
        commentService.deleteComment(commentId, userPrincipal.getUserId(), userPrincipal.isAdmin());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> toggleLike(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long groupId,
            @PathVariable Long commentId) {
        commentService.toggleLike(commentId, userPrincipal.getUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{commentId}/report")
    public ResponseEntity<Void> report(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> body) {
        commentService.reportComment(commentId, userPrincipal.getUserId(), body.get("reason"));
        return ResponseEntity.ok().build();
    }
}
