package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.report.ReportRequestDto;
import com.climbCommunity.backend.dto.report.ReportResponseDto;
import com.climbCommunity.backend.entity.Report;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.service.ReportService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> createReport(@RequestBody ReportRequestDto dto) {
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = Report.builder()
                .targetType(TargetType.valueOf(dto.getTargetType()))
                .targetId(dto.getTargetId())
                .user(user)
                .reason(dto.getReason())
                .build();

        Report savedReport = reportService.saveReport(report);

        ReportResponseDto response = ReportResponseDto.builder()
                .id(savedReport.getId())
                .targetType(savedReport.getTargetType().name())
                .targetId(savedReport.getTargetId())
                .username(user.getUsername())
                .reason(savedReport.getReason())
                .createdAt(savedReport.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();

        return ResponseEntity.ok(response);
    }
}