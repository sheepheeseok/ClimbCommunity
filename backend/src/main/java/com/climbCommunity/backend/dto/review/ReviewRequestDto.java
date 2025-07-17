package com.climbCommunity.backend.dto.review;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDto {
    private Long gymId;
    private Long userId;
    private int rating;
    private String content;
}
