package com.climbCommunity.backend.dto.user;

import lombok.Data;

@Data
public class PasswordChangeRequestDto {
    private String currentPassword;
    private String newPassword;
}
