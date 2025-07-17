package com.climbCommunity.backend.dto.reviewlike;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewLikeResponseDto {
    private Long id;
    private Long reviewId;
    private Long userId;
}
