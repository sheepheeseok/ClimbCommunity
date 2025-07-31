package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyGroupCommentDto {
    private Long groupCommentId;
    private String content;
    private Long groupId;
    private String createdAt;
}
