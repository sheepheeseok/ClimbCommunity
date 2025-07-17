package com.climbCommunity.backend.dto.comment;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentResponseDto {
    private Long id;
    private String content;
    private String username;
    private String createdAt;
    private Long parentCommentId;
}
