package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyApplicationDto {
    private Long recruitmentId;
    private String title;
    private String status;
    private String appliedAt;
}
