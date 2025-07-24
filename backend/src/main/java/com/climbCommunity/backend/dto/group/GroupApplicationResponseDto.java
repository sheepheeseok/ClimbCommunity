package com.climbCommunity.backend.dto.group;

import com.climbCommunity.backend.entity.GroupApplication;
import com.climbCommunity.backend.entity.enums.ApplicationStatus;
import com.climbCommunity.backend.entity.enums.Grade;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GroupApplicationResponseDto {
    private Long id;
    private String userId;
    private String username;
    private String profileImage;
    private Grade grade;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public static GroupApplicationResponseDto from(GroupApplication app) {
        return GroupApplicationResponseDto.builder()
                .id(app.getId())
                .userId(app.getUser().getUserId())
                .username(app.getUser().getUsername())
                .profileImage(app.getUser().getProfileImage())
                .grade(app.getUser().getGrade())
                .status(app.getStatus())
                .appliedAt(app.getCreatedAt())
                .build();
    }
}
