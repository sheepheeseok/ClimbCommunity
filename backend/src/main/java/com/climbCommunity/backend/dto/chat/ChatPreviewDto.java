package com.climbCommunity.backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatPreviewDto {
    private Long roomId;
    private Long userId;       // 상대방 userId
    private String username;     // 상대방 닉네임
    private String profileImage; // 상대방 프로필
    private String lastMessage;
    private String timestamp;
    private int unreadCount;
    private boolean online;
}
