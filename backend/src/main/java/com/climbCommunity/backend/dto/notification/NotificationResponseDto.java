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
    private String preview;
    private String targetType;
    private String profileImage;
    private Long targetId;
    private Long commentId;
    private Long postId;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private String actorUserId;
    private String actorUsername;
    private String actorProfileImage;

    public static NotificationResponseDto from(Notification notification, Long postId, Long commentId) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .type(notification.getType().name())
                .message(notification.getMessage())
                .preview(notification.getPreview())
                .targetType(notification.getTargetType() != null ? notification.getTargetType().name() : null)
                .profileImage(notification.getUser().getProfileImage())
                .targetId(notification.getTargetId())
                .postId(postId)
                .commentId(commentId)
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .actorUserId(notification.getActor().getUserId())
                .actorUsername(notification.getActor().getUsername())
                .actorProfileImage(notification.getActor().getProfileImage())
                .build();
    }
}
