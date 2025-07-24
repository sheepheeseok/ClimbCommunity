package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.group.GroupRecruitmentDetailDto;
import com.climbCommunity.backend.dto.group.GroupRecruitmentRequestDto;
import com.climbCommunity.backend.dto.group.GroupRecruitmentResponseDto;
import com.climbCommunity.backend.dto.group.GroupRecruitmentSummaryDto;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.GroupRecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupRecruitmentController {

    private final GroupRecruitmentService groupRecruitmentService;

    // 그룹 생성
    @PostMapping("/recruitment")
    public ResponseEntity<GroupRecruitmentResponseDto> createRecruitment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody GroupRecruitmentRequestDto dto) {

        GroupRecruitmentResponseDto response = groupRecruitmentService.createRecruitment(userPrincipal.getUserId(), dto);
        return ResponseEntity.ok(response);
    }

    // 그룹글 조회
    @GetMapping("/recruitment")
    public ResponseEntity<Page<GroupRecruitmentSummaryDto>> getRecruitmentList(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<GroupRecruitmentSummaryDto> result = groupRecruitmentService.getRecruitmentList(keyword, page, size);
        return ResponseEntity.ok(result);
    }

    // 그룹글 상세 조회
    @GetMapping("/recruitment/{groupId}")
    public ResponseEntity<GroupRecruitmentDetailDto> getRecruitment(@PathVariable Long groupId){
        return ResponseEntity.ok(groupRecruitmentService.getRecruitmentDetail(groupId));
    }

    // 그룹글 수정
    @PatchMapping("/recruitment/{groupId}")
    public ResponseEntity<Void> updateRecruitment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long groupId,
            @RequestBody GroupRecruitmentRequestDto dto) {
        groupRecruitmentService.updateRecruitment(userPrincipal.getUserId(), groupId, dto);
        return ResponseEntity.noContent().build();
    }

    // 그룹글 삭제
    @DeleteMapping("/recruitment/{groupId}")
    public ResponseEntity<Void> deleteRecruitment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long groupId) {
        groupRecruitmentService.deleteRecruitment(userPrincipal.getUserId(), groupId);
        return ResponseEntity.noContent().build();
    }
}
