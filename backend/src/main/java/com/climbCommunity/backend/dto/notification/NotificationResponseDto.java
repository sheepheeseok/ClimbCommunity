package com.climbCommunity.backend.dto.notification;

import com.climbCommunity.backend.entity.Notification;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponseDto {
    private Long id;
    private String type;
    private String message;
    private String targetType;
    private Long targetId;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponseDto from(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .type(notification.getType().name())
                .message(notification.getMessage())
                .targetType(notification.getTargetType().name())
                .targetId(notification.getTargetId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
