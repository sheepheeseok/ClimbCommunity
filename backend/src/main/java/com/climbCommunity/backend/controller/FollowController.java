package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.user.UserResponseDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.service.FollowService;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.NotificationService;
import com.climbCommunity.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final UserService userService;
    private final NotificationService notificationService;

    @PostMapping("/{followeeId}/follow")
    public ResponseEntity<Map<String, String>> follow(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                      @PathVariable String followeeId) {
        followService.follow(userPrincipal.getUserId(), followeeId);

        User follower = userService.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        User followee = userService.findByUserId(followeeId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));


        if (!follower.getUserId().equals(followee.getUserId())) {
            notificationService.createNotification(
                    followee.getId(),                                    // 알림 받을 사용자 (팔로우 당한 사람)
                    userPrincipal.getId(),
                    NotificationType.FOLLOW,                             // 알림 타입
                    TargetType.USER,                                                // 대상 타입 없음
                    follower.getId(),                                                // 대상 ID 없음
                    "님이 당신을 팔로우했습니다." // 메시지
            );
        }
        return ResponseEntity.ok(Map.of("message", "팔로우 성공"));
    }

    @DeleteMapping("/{followeeId}/follow")
    public ResponseEntity<Map<String, String>> unfollow(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String followeeId) {

        followService.unfollow(userPrincipal.getUserId(), followeeId);

        // ✅ 팔로우 알림 삭제
        notificationService.deleteFollowNotification(userPrincipal.getUserId(), followeeId);

        return ResponseEntity.ok(Map.of("message", "언팔로우 성공"));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UserResponseDto>> getFollowers(@PathVariable String userId) {
        List<UserResponseDto> followers = followService.getFollowers(userId)
                .stream()
                .map(UserResponseDto::fromEntity)
                .toList();
                return ResponseEntity.ok(followers);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserResponseDto>> getFollowing(@PathVariable String userId) {
        List<UserResponseDto> following = followService.getFollowing(userId)
                .stream()
                .map(UserResponseDto::fromEntity)
                .toList();
                return ResponseEntity.ok(following);
    }

    @GetMapping("/{targetUserId}/is-following")
    public ResponseEntity<Map<String, Boolean>> isFollowing(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String targetUserId
    ) {
        boolean isFollowing = followService.isFollowing(userPrincipal.getUserId(), targetUserId);
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }
}
