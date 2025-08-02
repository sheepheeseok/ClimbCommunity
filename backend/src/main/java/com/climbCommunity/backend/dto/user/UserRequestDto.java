package com.climbCommunity.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserRequestDto {
    private Long id;
    private String userId;
    private String username;
    private String email;
    private String password;
    private String tel;
    private String address1;
    private String address2;
    private String Grade;
    private String profileImage;
}
