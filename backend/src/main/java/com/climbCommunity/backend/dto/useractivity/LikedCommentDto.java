package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LikedCommentDto {
    private Long commentId;
    private String preview;
    private String likedAt;
}
