package com.climbCommunity.backend.dto.report;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReportResponseDto {
    private Long id;
    private String targetType;
    private Long targetId;
    private String username;
    private String reason;
    private String createdAt;
}
