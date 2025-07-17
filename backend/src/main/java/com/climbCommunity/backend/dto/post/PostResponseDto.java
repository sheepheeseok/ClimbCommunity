package com.climbCommunity.backend.dto.post;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String username;
    private String createdAt;
    private String updatedAt;
}
