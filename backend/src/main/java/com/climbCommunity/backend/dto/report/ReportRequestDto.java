package com.climbCommunity.backend.dto.report;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequestDto {
    private String targetType;
    private Long targetId;
    private Long userId;
    private String reason;
}
