package com.climbCommunity.backend.dto.user;

import lombok.Data;

@Data
public class UserUpdateRequestDto {
    private String username;
    private String bio;
    private String profileImage;
    private String website;
}
