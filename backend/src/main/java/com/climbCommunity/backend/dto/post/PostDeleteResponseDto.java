package com.climbCommunity.backend.dto.post;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostDeleteResponseDto {
    private Long postId;
    private String message;
}
