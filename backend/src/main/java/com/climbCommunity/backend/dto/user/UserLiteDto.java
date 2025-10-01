package com.climbCommunity.backend.dto.user;

import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.FollowStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLiteDto {
    private String userId;
    private String username;
    private String profileImage;
    private String followStatus;

    public static UserLiteDto fromEntity(User user, FollowStatus status) {
        return UserLiteDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .followStatus(status != null ? status.name() : null)
                .build();
    }
}
