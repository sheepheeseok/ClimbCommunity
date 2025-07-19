package com.climbCommunity.backend.dto.user;

import lombok.Data;

@Data
public class UserUpdateRequestDto {
    private String username;
    private String tel;
    private String address1;
    private String address2;
    private String profileImage;
}
