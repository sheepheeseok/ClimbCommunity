package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.chat.ChatPreviewDto;
import com.climbCommunity.backend.entity.Message;
import com.climbCommunity.backend.dto.chat.ChatMessageDto;
import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.MessageType;
import com.climbCommunity.backend.repository.ChatRoomRepository;
import com.climbCommunity.backend.repository.MessageRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 메시지 저장
     */
    public Message saveMessage(ChatMessageDto dto) {
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + dto.getSenderId()));

        ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Room not found: " + dto.getRoomId()));

        Message msg = Message.builder()
                .room(room)
                .sender(sender)
                .content(dto.getContent())
                .type(MessageType.valueOf(dto.getType()))
                .build();

        return messageRepository.save(msg);
    }

    /**
     * 특정 방의 메시지 조회 (오래된 순)
     */
    public List<Message> getMessages(Long roomId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room not found: " + roomId));

        return messageRepository.findByRoomOrderByCreatedAtAsc(room);
    }

    /**
     * 1:1 채팅방 목록 조회
     */
    public List<ChatPreviewDto> getChatList(Long accountId) {
        User me = userRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + accountId));

        // account/partner 구조 기반
        List<ChatRoom> rooms = chatRoomRepository.findByAccountOrPartner(me, me);

        return rooms.stream().map(room -> {
            User partner = room.getAccount().equals(me) ? room.getPartner() : room.getAccount();

            Message lastMsg = messageRepository.findTopByRoomOrderByCreatedAtDesc(room).orElse(null);

            long unreadCount = messageRepository.countUnreadMessages(room, me);
            return ChatPreviewDto.builder()
                    .roomId(room.getId())                         // 방 PK
                    .partnerId(partner.getId())                   // 상대방 PK
                    .partnerUserId(partner.getUserId())           // 상대방 비즈니스 ID
                    .username(partner.getUsername())
                    .profileImage(partner.getProfileImage())
                    .lastMessage(lastMsg != null ? lastMsg.getContent() : "")
                    .type(lastMsg != null ? lastMsg.getType().name() : "CHAT")
                    .timestamp(lastMsg != null ? lastMsg.getCreatedAt().format(FORMATTER) : null)
                    .unreadCount(unreadCount)
                    .online(false)    // TODO: Presence 구현
                    .build();
        }).toList();
    }

    @Transactional
    public void markAsRead(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room not found: " + roomId));

        User me = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        int updated = messageRepository.markMessagesAsRead(room, me);
        System.out.println("✅ " + updated + " messages marked as read in room " + roomId);
    }
}
