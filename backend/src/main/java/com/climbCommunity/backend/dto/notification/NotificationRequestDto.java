package com.climbCommunity.backend.dto.notification;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequestDto {
    private Long userId;
    private String type;
    private String message;
}
