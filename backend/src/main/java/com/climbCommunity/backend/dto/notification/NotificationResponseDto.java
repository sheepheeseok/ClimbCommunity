package com.climbCommunity.backend.dto.notification;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationResponseDto {
    private Long id;
    private String username;
    private String type;
    private String message;
    private Boolean isRead;
    private String createdAt;
}
