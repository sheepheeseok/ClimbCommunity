package com.climbCommunity.backend.dto.reviewlike;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewLikeRequestDto {
    private Long reviewId;
    private Long userId;
}
