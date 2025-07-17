package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.notification.NotificationRequestDto;
import com.climbCommunity.backend.dto.notification.NotificationResponseDto;
import com.climbCommunity.backend.entity.Notification;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.NotificationService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<NotificationResponseDto> createNotification(@RequestBody NotificationRequestDto dto) {
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(Notification.NotificationType.valueOf(dto.getType()))
                .message(dto.getMessage())
                .build();

        Notification savedNotification = notificationService.saveNotification(notification);

        NotificationResponseDto response = NotificationResponseDto.builder()
                .id(savedNotification.getId())
                .username(user.getUsername())
                .type(savedNotification.getType().name())
                .message(savedNotification.getMessage())
                .isRead(savedNotification.getIsRead())
                .createdAt(savedNotification.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@PathVariable Long userId) {
        List<NotificationResponseDto> notifications = notificationService.getUnreadNotificationsByUserId(userId).stream()
                .map(notification -> NotificationResponseDto.builder()
                        .id(notification.getId())
                        .username(notification.getUser().getUsername())
                        .type(notification.getType().name())
                        .message(notification.getMessage())
                        .isRead(notification.getIsRead())
                        .createdAt(notification.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }
}
