package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.notification.NotificationResponseDto;
import com.climbCommunity.backend.dto.notification.NotificationSocketMessage;
import com.climbCommunity.backend.entity.Notification;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.repository.NotificationRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener; // ✅ 이벤트 리스너
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // 전체 알림 조회 (읽은 것 + 안 읽은 것 모두)
    public List<NotificationResponseDto> getAllNotifications(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
    }

    // 알림 생성 및 WebSocket Push
    public void createNotification(Long userId, NotificationType type, TargetType targetType, Long targetId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .targetType(targetType)
                .targetId(targetId)
                .message(message)
                .isRead(false) // ✅ Builder.Default 로 처리했으면 생략 가능
                .build();

        notificationRepository.save(notification);

        // WebSocket 실시간 알림 Push
        NotificationSocketMessage socketMessage = new NotificationSocketMessage(
                user.getUserId(), message, type.name(),
                targetType != null ? targetType.name() : null, // null-safe
                targetId
        );
        messagingTemplate.convertAndSend("/topic/notifications/" + user.getUserId(), socketMessage);
    }

    // 팔로우 취소 시 알림 제거
    public void deleteFollowNotification(String followerUserId, String followeeUserId) {
        User follower = userRepository.findByUserId(followerUserId)
                .orElseThrow(() -> new EntityNotFoundException("팔로워를 찾을 수 없습니다."));
        User followee = userRepository.findByUserId(followeeUserId)
                .orElseThrow(() -> new EntityNotFoundException("팔로우 당한 사용자를 찾을 수 없습니다."));

        notificationRepository.findByUser_IdAndTypeAndTargetTypeAndTargetId(
                followee.getId(),
                NotificationType.FOLLOW,
                TargetType.USER,
                follower.getId()
        ).ifPresent(notificationRepository::delete);
    }

    // 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("알림을 찾을 수 없습니다."));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // 모든 알림 읽음 처리
    public void markAllAsRead(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setRead(true)); // ✅ 동일하게 setIsRead 사용
        notificationRepository.saveAll(notifications);
    }
}
