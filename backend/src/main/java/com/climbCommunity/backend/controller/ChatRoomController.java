package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @PostMapping("/start")
    public ResponseEntity<Long> startChat(
            @RequestParam Long myId,
            @RequestParam Long partnerId
    ) {
        Long roomId = chatRoomService.createOrGetRoom(myId, partnerId).getId();
        return ResponseEntity.ok(roomId);
    }
}

