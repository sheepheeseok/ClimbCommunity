package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.user.UserResponseDto;
import com.climbCommunity.backend.entity.Follow;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.FollowService;
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

    /**
     * 팔로우 요청
     * 공개 계정 → 바로 팔로우 ACCEPTED
     * 비공개 계정 → FOLLOW_REQUEST 알림 전송 + PENDING 상태
     */
    @PostMapping("/{followeeId}/follow")
    public ResponseEntity<Map<String, String>> requestFollow(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String followeeId) {

        Follow follow = followService.requestFollow(userPrincipal.getUserId(), followeeId);

        User followee = follow.getFollowee();

        return ResponseEntity.ok(Map.of(
                "message", (followee.isPrivate() ? "팔로우 요청 전송" : "팔로우 성공")
        ));
    }

    /**
     * 팔로우 요청 승인
     */
    @PatchMapping("/follow-requests/{followId}/accept")
    public ResponseEntity<Map<String, String>> acceptFollow(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long followId) {

        followService.acceptFollow(followId);

        // 알림 전송: 요청 보낸 사람에게 "팔로우 요청이 수락되었습니다"
        Follow follow = followService.findById(followId)
                .orElseThrow(() -> new EntityNotFoundException("팔로우 요청 없음"));

        notificationService.createNotification(
                follow.getFollower().getId(),   // 알림 받을 사람 (요청 보낸 사람)
                principal.getId(),              // 수락한 사람
                NotificationType.FOLLOW,
                TargetType.USER,
                follow.getFollowee().getId(),
                "님이 팔로우 요청을 수락했습니다."
        );

        return ResponseEntity.ok(Map.of("message", "팔로우 요청을 승인했습니다."));
    }

    /**
     * 팔로우 요청 거절
     */
    @PatchMapping("/follow-requests/{followId}/reject")
    public ResponseEntity<Map<String, String>> rejectFollow(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long followId) {

        // 팔로우 요청 찾기
        Follow follow = followService.findById(followId)
                .orElseThrow(() -> new EntityNotFoundException("팔로우 요청 없음"));

        // 🔥 알림 삭제 (해당 팔로우 요청 알림 제거)
        notificationService.deleteFollowRequestNotification(
                follow.getFollowee().getId(),   // 알림 받은 사람 (나, 계정 주인)
                follow.getFollower().getId(),   // 요청 보낸 사람
                follow.getId()                  // followId (targetId)
        );

        // 🔥 DB에서 팔로우 요청 삭제
        followService.rejectFollow(followId);

        return ResponseEntity.ok(Map.of("message", "팔로우 요청을 거절했습니다."));
    }

    /**
     * 언팔로우
     */
    @DeleteMapping("/{followeeId}/follow")
    public ResponseEntity<Map<String, String>> unfollow(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String followeeId) {

        followService.unfollow(userPrincipal.getUserId(), followeeId);

        // 팔로우 알림 삭제 (승인된 경우만 삭제)
        notificationService.deleteFollowNotification(userPrincipal.getUserId(), followeeId);

        return ResponseEntity.ok(Map.of("message", "언팔로우 성공"));
    }

    /**
     * 팔로워 목록 (승인된 팔로우만)
     */
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UserResponseDto>> getFollowers(
            @PathVariable String userId,
            @AuthenticationPrincipal UserPrincipal principal) {

        String myUserId = principal.getUserId();
        List<UserResponseDto> followers = followService.getFollowers(userId)
                .stream()
                .map(user -> UserResponseDto.fromEntity(
                        user,
                        followService.isFollowing(myUserId, user.getUserId()) // 로그인 사용자와 관계 표시
                ))
                .toList();

        return ResponseEntity.ok(followers);
    }

    /**
     * 팔로잉 목록 (승인된 팔로우만)
     */
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserResponseDto>> getFollowing(
            @PathVariable String userId,
            @AuthenticationPrincipal UserPrincipal principal) {

        String myUserId = principal.getUserId();
        List<UserResponseDto> following = followService.getFollowing(userId)
                .stream()
                .map(user -> UserResponseDto.fromEntity(
                        user,
                        followService.isFollowing(myUserId, user.getUserId())
                ))
                .toList();

        return ResponseEntity.ok(following);
    }

    /**
     * 특정 사용자 팔로우 여부 확인 (ACCEPTED만 true)
     */
    @GetMapping("/{targetUserId}/follow-status")
    public ResponseEntity<Map<String, String>> getFollowStatus(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String targetUserId) {

        String status = followService.getFollowStatus(userPrincipal.getUserId(), targetUserId);
        return ResponseEntity.ok(Map.of("status", status));
    }

    /**
     * 내가 받은 팔로우 요청 목록 (PENDING 상태)
     */
    @GetMapping("/follow-requests")
    public ResponseEntity<List<UserResponseDto>> getPendingRequests(
            @AuthenticationPrincipal UserPrincipal principal) {

        List<UserResponseDto> requests = followService.getPendingRequests(principal.getUserId())
                .stream()
                .map(follow -> UserResponseDto.fromEntity(follow.getFollower(), false))
                .toList();

        return ResponseEntity.ok(requests);
    }

    @DeleteMapping("/follow-requests/{targetUserId}/cancel")
    public ResponseEntity<Map<String, String>> cancelRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String targetUserId) {

        followService.cancelFollowRequest(principal.getUserId(), targetUserId);
        return ResponseEntity.ok(Map.of("message", "팔로우 요청을 취소했습니다."));
    }
}
