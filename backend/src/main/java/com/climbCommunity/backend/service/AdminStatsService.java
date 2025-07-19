package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.admin.UserStatsResponseDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;

    @Transactional
    public UserStatsResponseDto getUserStats() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        long totalUsers = userRepository.countByStatus(Status.active);
        long newUsersToday = userRepository.countByCreatedAtAfterAndStatus(startOfToday, Status.active);
        long newUsersThisWeek = userRepository.countByCreatedAtAfterAndStatus(startOfWeek, Status.active);
        long newUsersThisMonth = userRepository.countByCreatedAtAfterAndStatus(startOfMonth, Status.active);
        long deletedUsersThisMonth = userRepository.countByDeletedAtAfterAndStatus(startOfMonth, Status.deleted);

        return UserStatsResponseDto.builder()
                .totalUsers(totalUsers)
                .newUsersToday(newUsersToday)
                .newUsersThisWeek(newUsersThisWeek)
                .newUsersThisMonth(newUsersThisMonth)
                .deletedUsersThisMonth(deletedUsersThisMonth)
                .build();
    }
}
