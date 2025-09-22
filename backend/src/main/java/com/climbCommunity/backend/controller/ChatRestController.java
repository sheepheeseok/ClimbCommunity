package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.chat.ChatMessageDto;
import com.climbCommunity.backend.dto.chat.ChatPreviewDto;
import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.Message;
import com.climbCommunity.backend.service.ChatRoomService;
import com.climbCommunity.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatRestController {

    private final ChatService chatService;
    private final ChatRoomService chatRoomService;

    /**
     * ✅ 1:1 채팅방 생성 (또는 기존 방 반환)
     */
    @PostMapping("/room")
    public ResponseEntity<Long> createRoom(@RequestParam Long userId1, @RequestParam Long userId2) {
        ChatRoom room = chatRoomService.createOrGetRoom(userId1, userId2);
        return ResponseEntity.ok(room.getId());
    }

    /**
     * ✅ 내 채팅방 목록 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<ChatPreviewDto>> getChatList(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getChatList(userId));
    }

    /**
     * ✅ 특정 방의 메시지 조회
     */
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@PathVariable Long roomId) {
        List<Message> messages = chatService.getMessages(roomId);
        List<ChatMessageDto> dtoList = messages.stream()
                .map(ChatMessageDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @PatchMapping("/{roomId}/read")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long roomId,
            @RequestParam Long userId
    ) {
        chatService.markAsRead(roomId, userId);
        return ResponseEntity.ok().build();
    }
}
