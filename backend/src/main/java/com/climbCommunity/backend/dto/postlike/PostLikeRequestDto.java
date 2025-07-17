package com.climbCommunity.backend.dto.postlike;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostLikeRequestDto {
    private Long postId;
    private Long userId;
}
