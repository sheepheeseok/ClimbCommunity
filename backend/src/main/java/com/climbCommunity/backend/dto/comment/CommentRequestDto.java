package com.climbCommunity.backend.dto.comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    private Long postId;
    private Long userId;
    private Long parentCommentId;
    private String content;
}
