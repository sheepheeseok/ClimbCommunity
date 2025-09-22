package com.climbCommunity.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSearchResponseDto {
    private Long id;          // PK
    private String userId;    // 비즈니스용 ID
    private String username;  // 닉네임
    private String profileImage;
}
