package com.climbCommunity.backend.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDto {
    private String accessToken;
    private Long id;
    private String userId;
    private String username;
    private String email;
    private String tel;
    private String address1;
    private String address2;
    private String grade;
    private String profileImage;
}
