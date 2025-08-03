package com.climbCommunity.backend.dto.user;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRegisterRequestDto {
    private String userId;
    private String username;
    private String email;
    private String password;
    private String tel;
    private String address1;
    private String address2;
    private LocalDate birthdate;
    private String gender;
    private String grade;
}
