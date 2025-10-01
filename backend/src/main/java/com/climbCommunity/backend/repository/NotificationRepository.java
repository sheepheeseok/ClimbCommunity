package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Notification;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // 기존: 안 읽은 것만
    List<Notification> findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    // 새로 추가: 전부
    List<Notification> findByUser_IdOrderByCreatedAtDesc(Long userId);
    // User의 PK(id) + 타입 + TargetType + TargetId 기준 조회
    Optional<Notification> findByUser_IdAndTypeAndTargetTypeAndTargetId(
            Long userId, NotificationType type, TargetType targetType, Long targetId
    );
    void deleteByUser_IdAndActor_IdAndTypeAndTargetTypeAndTargetId(
            Long userId,
            Long actorId,
            NotificationType type,
            TargetType targetType,
            Long targetId
    );

    boolean existsByUser_IdAndActor_IdAndTypeAndTargetTypeAndTargetId(
            Long userId,
            Long actorId,
            NotificationType type,
            TargetType targetType,
            Long targetId
    );
}
