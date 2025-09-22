package com.climbCommunity.backend.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationSocketMessage {
    // 알림 받는 사람 (수신자)
    private String receiverUserId;

    // 알림 발생시킨 사람 (행위자)
    private String actorUserId;
    private String actorProfileImage;

    // 알림 본문
    private String message;
    private String type;
    private String targetType;
    private Long targetId;
}
