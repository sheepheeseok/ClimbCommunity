package com.climbCommunity.backend.dto.chat;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private String type;   // CHAT, TYPING, IMAGE, VIDEO
    private Long roomId;
    private Long senderId;
    private String content; // 메시지 내용 or 파일 URL
}