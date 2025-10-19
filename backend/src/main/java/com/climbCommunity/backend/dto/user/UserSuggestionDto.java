package com.climbCommunity.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSuggestionDto {
    private String userId; // 비즈니스 ID
    private String username;
    private String profileImage;
}
