package com.climbCommunity.backend.dto.postlike;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostLikeResponseDto {
    private Long id;
    private Long postId;
    private Long userId;
}
