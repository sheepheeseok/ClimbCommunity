package com.climbCommunity.backend.dto.groupmember;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupMemberResponseDto {
    private Long id;
    private Long groupId;
    private String username;
    private String joinedAt;
}
