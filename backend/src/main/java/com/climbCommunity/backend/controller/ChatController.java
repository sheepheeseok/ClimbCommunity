package com.climbCommunity.backend.controller;
import com.climbCommunity.backend.entity.Message;
import com.climbCommunity.backend.dto.chat.ChatMessageDto;
import com.climbCommunity.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageDto dto) {
        Message saved = chatService.saveMessage(dto);
        messagingTemplate.convertAndSend("/topic/chat/" + dto.getRoomId(), dto);
    }

    @MessageMapping("/chat.typing")
    public void typing(ChatMessageDto dto) {
        messagingTemplate.convertAndSend("/topic/chat/" + dto.getRoomId(), dto);
    }
}
