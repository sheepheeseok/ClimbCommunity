package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.location.Coordinate;
import com.climbCommunity.backend.dto.location.LocationVerificationRequestDto;
import com.climbCommunity.backend.dto.location.LocationVerificationResponseDto;
import com.climbCommunity.backend.dto.useractivity.*;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserActivityController {

    private final PostService postService;
    private final CommentService commentService;
    private final LikeService likeService;
    private final GroupApplicationService groupApplicationService;
    private final GroupCommentService groupCommentService;
    private final GroupRecruitmentService groupRecruitmentService;
    private final NaverReverseGeocodingService reverseGeocodingService;
    private final LocationVerificationService locationVerificationService;

    // 1. 내가 쓴 게시글
    @GetMapping("/posts")
    public ResponseEntity<List<MyPostDto>> getMyPosts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(postService.getMyPosts(userId));
    }

    // 2. 내가 쓴 그룹글
    @GetMapping("/recruitment")
    public ResponseEntity<List<MyRecruitmentDto>> getMyRecruitment(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(groupRecruitmentService.getMyRecruitment(userId));
    }

    // 3. 내가 쓴 댓글
    @GetMapping("/comments")
    public ResponseEntity<List<MyCommentDto>> getMyComments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(commentService.getMyComments(userId));
    }

    // 4. 내가 쓴 그룹글 댓글
    @GetMapping("/groupComments")
    public ResponseEntity<List<MyGroupCommentDto>> getMyGroupComments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(groupCommentService.getMyGroupComments(userId));
    }

    // 5. 내가 좋아요한 게시글
    @GetMapping("/likes/posts")
    public ResponseEntity<List<LikedPostDto>> getLikedPosts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(likeService.getLikedPosts(userId));
    }

    // 6. 내가 좋아요한 댓글
    @GetMapping("/likes/comments")
    public ResponseEntity<List<LikedCommentDto>> getLikedComments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(likeService.getLikedComments(userId));
    }

    // 7. 내가 좋아요한 그룹글 댓글
    @GetMapping("/likes/groupComments")
    public ResponseEntity<List<LikedGroupCommentDto>> getLikedGroupComments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(likeService.getLikedGroupComments(userId));
    }

    // 8. 내가 신청한 그룹 모집글
    @GetMapping("/applications")
    public ResponseEntity<List<MyApplicationDto>> getMyApplications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(groupApplicationService.getApplicationsByUser(userId));
    }

    @PostMapping("/verify-location")
    public ResponseEntity<?> verifyLocation(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody LocationVerificationRequestDto dto) {

        LocationVerificationResponseDto response = locationVerificationService.verifyLocation(userPrincipal.getId(), dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reverse")
    public ResponseEntity<String> getDongAddress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam double lat,
            @RequestParam double lng) {

        return reverseGeocodingService.reverseGeocodeOnly(lat, lng)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok("주소를 찾을 수 없습니다."));
    }

    @GetMapping("/locations")
    public ResponseEntity<List<LocationVerificationResponseDto>> getVerifiedLocations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<LocationVerificationResponseDto> locations =
                locationVerificationService.getVerifiedLocations(userPrincipal.getId());

        return ResponseEntity.ok(locations);
    }

    // (선택) 9. 요약 통계
    @GetMapping("/summary")
    public ResponseEntity<MyActivitySummaryDto> getMyActivitySummary(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        MyActivitySummaryDto summary = MyActivitySummaryDto.builder()
                .postCount(postService.countByUser(userId))
                .recruitment(groupRecruitmentService.countByUser(userId))
                .commentCount(commentService.countByUser(userId))
                .groupCommentCount(groupCommentService.countByUser(userId))
                .likedPostCount(likeService.countLikedPosts(userId))
                .likedCommentCount(likeService.countLikedComments(userId))
                .likedGroupCommentCount(likeService.countLikedGroupComments(userId))
                .applicationCount(groupApplicationService.countByUser(userId))
                .build();

        return ResponseEntity.ok(summary);
    }
}
