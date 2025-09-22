package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.chat.ChatPreviewDto;
import com.climbCommunity.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatRestController {

    private final ChatService chatService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<ChatPreviewDto>> getChats(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getChatList(userId));
    }
}
