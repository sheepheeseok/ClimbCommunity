package com.climbCommunity.backend.dto.chat;

import com.climbCommunity.backend.entity.Message;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long id;
    private Long roomId;
    private Long senderId;
    private String username;
    private String content;
    private String type;       // CHAT, IMAGE, VIDEO, TYPING
    private String createdAt;

    public static ChatMessageDto fromEntity(Message msg) {
        return ChatMessageDto.builder()
                .id(msg.getId())
                .roomId(msg.getRoom().getId())
                .senderId(msg.getSender().getId())
                .username(msg.getSender().getUsername())
                .content(msg.getContent())
                .type(msg.getType().name())
                .createdAt(msg.getCreatedAt().toString())
                .build();
    }
}
