package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.group.GroupApplicationResponseDto;
import com.climbCommunity.backend.entity.enums.ApplicationStatus;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.GroupApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupApplicationController {

    private final GroupApplicationService applicationService;

    // 1. 신청하기
    @PostMapping("/{recruitmentId}/apply")
    public ResponseEntity<Void> apply(@PathVariable Long recruitmentId,
                                      @AuthenticationPrincipal UserPrincipal userPrincipal) {
        applicationService.apply(recruitmentId, userPrincipal.getUserId());
        return ResponseEntity.ok().build();
    }

    // 2. 신청 취소
    @DeleteMapping("/{recruitmentId}/apply")
    public ResponseEntity<Void> cancel(@PathVariable Long recruitmentId,
                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        applicationService.cancel(recruitmentId, userPrincipal.getUserId());
        return ResponseEntity.noContent().build();
    }

    // 3. 신청자 목록 조회 (작성자만 가능)
    @GetMapping("/{recruitmentId}/applications")
    public ResponseEntity<List<GroupApplicationResponseDto>> list(@PathVariable Long recruitmentId,
                                                                  @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<GroupApplicationResponseDto> result = applicationService.getApplications(recruitmentId, userPrincipal.getUserId());
        return ResponseEntity.ok(result);
    }

    // 4. 신청 상태 변경 (수락/거절)
    @PatchMapping("/{recruitmentId}/applications/{applicantUserId}")
    public ResponseEntity<Void> updateStatus(@PathVariable Long recruitmentId,
                                             @PathVariable String applicantUserId,
                                             @RequestParam ApplicationStatus status,
                                             @AuthenticationPrincipal UserPrincipal userPrincipal) {
        applicationService.updateApplicationStatus(recruitmentId, applicantUserId, status, userPrincipal.getUserId());
        return ResponseEntity.ok().build();
    }
}
