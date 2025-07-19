package com.climbCommunity.backend.dto.user;

import com.climbCommunity.backend.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponseDto {
    private Long id;
    private String userId;
    private String username;
    private String email;
    private String tel;
    private String address1;
    private String address2;
    private String Grade;
    private String role;
    private String status;
    private String profileImage;
    private LocalDateTime createdAt;

    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .build();
    }
}
