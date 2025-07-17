package com.climbCommunity.backend.dto.post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequestDto {
    private Long userId;
    private String title;
    private String content;
}
