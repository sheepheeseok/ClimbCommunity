package com.climbCommunity.backend.scheduler;

import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UserCleanupScheduler {

    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 2 * * ?")
    public void purgeDeletedAccounts() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        List<User> expired = userRepository.findAllByStatusAndDeletedAtBefore(Status.deleted, cutoff);

        if (!expired.isEmpty()) {
            userRepository.deleteAll(expired);
            System.out.println("[알림] 30일 지난 탈퇴 계정 완전 삭제 완료");
        } else {
            System.out.println("[알림] 삭제할 계정 없음");
        }
    }
}
