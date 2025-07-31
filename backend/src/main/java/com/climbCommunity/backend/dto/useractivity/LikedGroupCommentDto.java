package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LikedGroupCommentDto {
    private Long groupCommentId;
    private String preview;
    private String likedAt;
}
