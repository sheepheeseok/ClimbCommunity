package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyActivitySummaryDto {
    private int postCount;
    private int recruitment;
    private int commentCount;
    private int groupCommentCount;
    private int likedPostCount;
    private int likedCommentCount;
    private int likedGroupCommentCount;
    private int applicationCount;
}
