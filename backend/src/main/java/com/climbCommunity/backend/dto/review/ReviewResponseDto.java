package com.climbCommunity.backend.dto.review;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponseDto {
    private Long id;
    private String gymName;
    private String username;
    private int rating;
    private String content;
    private String createdAt;
}
