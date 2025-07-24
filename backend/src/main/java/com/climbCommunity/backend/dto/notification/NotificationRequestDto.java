package com.climbCommunity.backend.dto.notification;

import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class NotificationRequestDto {
    private Long userId;
    private NotificationType type;  // LIKE, COMMENT, FOLLOW
    private TargetType targetType;  // POST, COMMENT
    private Long targetId;
    private String message;
}
