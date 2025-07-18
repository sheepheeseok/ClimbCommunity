package com.climbCommunity.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegisterResponseDto {
    private Long id;
    private String userId;
    private String username;
    private String email;
    private String grade;
    private String profileImage;
}
