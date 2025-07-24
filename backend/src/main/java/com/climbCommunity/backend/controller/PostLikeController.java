package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.postlike.PostLikeRequestDto;
import com.climbCommunity.backend.dto.postlike.PostLikeResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.PostLike;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.NotificationService;
import com.climbCommunity.backend.service.PostLikeService;
import com.climbCommunity.backend.service.PostService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostLikeController {
    private final PostLikeService postLikeService;
    private final PostService postService;
    private final NotificationService notificationService;

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId,
                                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
        System.out.println("Authorities: " + userPrincipal.getAuthorities());

        String userId = userPrincipal.getUserId();

        boolean alreadyLiked = postLikeService.hasUserLiked(userId, postId);
        if (alreadyLiked) {
            postLikeService.unlikePost(userId, postId);
            return ResponseEntity.ok("좋아요 취소");
        } else {
            postLikeService.likePost(userId, postId);

            Post post = postService.getPostById(postId);
            if(!post.getUser().getUserId().equals(userPrincipal.getUserId())) {
                notificationService.createNotification(
                        post.getUser().getId(),
                        NotificationType.LIKE,
                        TargetType.POST,
                        postId,
                        userPrincipal.getUsername() + "님이 게시글을 좋아했습니다."
                );
            }
            return ResponseEntity.ok("좋아요 추가");
        }
    }

    @GetMapping("/{postId}/like/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        return ResponseEntity.ok(postLikeService.countLikes(postId));
    }

    @GetMapping("/{postId}/like/check")
    public ResponseEntity<Boolean> hasUserLiked(@PathVariable Long postId,
                                                @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean liked = postLikeService.hasUserLiked(userPrincipal.getUserId(), postId);
        return ResponseEntity.ok(liked);
    }
}
