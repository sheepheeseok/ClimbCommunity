package com.climbCommunity.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserStatsResponseDto {
    private long totalUsers;
    private long newUsersToday;
    private long newUsersThisWeek;
    private long newUsersThisMonth;
    private long deletedUsersThisMonth;
}
