package com.climbCommunity.backend.dto.user;

import com.climbCommunity.backend.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLiteDto {
    private String userId;
    private String username;
    private String profileImage;

    public static UserLiteDto fromEntity(User user) {
        return UserLiteDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .build();
    }
}
