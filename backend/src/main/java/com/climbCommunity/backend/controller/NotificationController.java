package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.notification.NotificationRequestDto;
import com.climbCommunity.backend.dto.notification.NotificationResponseDto;
import com.climbCommunity.backend.entity.Notification;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.NotificationService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal.getUserId();
        List<NotificationResponseDto> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{alertId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long alertId) {
        notificationService.markAsRead(alertId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllNotificationsAsRead(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal.getUserId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }
}