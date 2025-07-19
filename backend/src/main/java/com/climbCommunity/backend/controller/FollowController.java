package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.user.UserResponseDto;
import com.climbCommunity.backend.service.FollowService;
import com.climbCommunity.backend.security.UserPrincipal;
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

    @PostMapping("/{followeeId}/follow")
    public ResponseEntity<Map<String, String>> follow(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                      @PathVariable String followeeId) {
        followService.follow(userPrincipal.getUserId(), followeeId);
        return ResponseEntity.ok(Map.of("message", "팔로우 성공"));
    }

    @DeleteMapping("/{followeeId}/follow")
    public ResponseEntity<Map<String, String>> unfollow(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                        @PathVariable String followeeId) {
        followService.unfollow(userPrincipal.getUserId(), followeeId);
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
}
