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

    // 전체 알림 조회 (읽지 않은 것만)
    public List<NotificationResponseDto> getUnreadNotifications(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId())
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
                .build();

        notificationRepository.save(notification);

        // WebSocket 실시간 알림 Push
        NotificationSocketMessage socketMessage = new NotificationSocketMessage(
                user.getUserId(), message, type.name(), targetType.name(), targetId
        );
        messagingTemplate.convertAndSend("/topic/notifications/" + user.getUserId(), socketMessage);
    }

    // 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("알림을 찾을 수 없습니다."));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    // 모든 알림 읽음 처리
    public void markAllAsRead(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
}
