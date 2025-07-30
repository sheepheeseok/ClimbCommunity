package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class MyRecruitmentDto {
    private Long groupPostId;
    private String title;
    private String status;
    private String createdAt;
}
