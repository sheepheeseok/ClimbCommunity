package com.climbCommunity.backend.dto.groupmember;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupMemberRequestDto {
    private Long groupId;
    private Long userId;
}
