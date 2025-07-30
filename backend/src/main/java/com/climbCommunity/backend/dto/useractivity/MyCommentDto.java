package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyCommentDto {
    private Long commentId;
    private String content;
    private Long postId;
    private String createdAt;
}
