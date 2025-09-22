package com.climbCommunity.backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatPreviewDto {
    private Long roomId;
    private Long partnerId;
    private Long userId;
    private String partnerUserId;
    private String username;     // 상대방 닉네임
    private String profileImage; // 상대방 프로필
    private String lastMessage;
    private String type;
    private String timestamp;
    private long unreadCount;
    private boolean online;
}
