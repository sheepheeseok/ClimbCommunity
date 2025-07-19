package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.admin.UserStatsResponseDto;
import com.climbCommunity.backend.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<UserStatsResponseDto> getUserStats() {
        UserStatsResponseDto stats = adminStatsService.getUserStats();
        return ResponseEntity.ok(stats);
    }
}
