package com.climbCommunity.backend.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationSocketMessage {
    private String receiverUserId;
    private String message;
    private String type;
    private String targetType;
    private Long targetId;
}
