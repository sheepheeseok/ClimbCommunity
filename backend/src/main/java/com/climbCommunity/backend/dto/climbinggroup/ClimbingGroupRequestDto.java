package com.climbCommunity.backend.dto.climbinggroup;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClimbingGroupRequestDto {
    private Long creatorId;
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
}
