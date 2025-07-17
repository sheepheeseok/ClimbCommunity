package com.climbCommunity.backend.dto.climbinggroup;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ClimbingGroupResponseDto {
    private Long id;
    private String creatorUsername;
    private String title;
    private String description;
    private String location;
    private String eventDate;
    private String createdAt;
}
