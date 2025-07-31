package com.climbCommunity.backend.dto.useractivity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyPostDto {
    private Long postId;
    private String title;
    private String category;
    private String createdAt;
}
