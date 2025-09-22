package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.chat.ChatMessageDto;
import com.climbCommunity.backend.dto.chat.ChatPreviewDto;
import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.Message;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.MessageType;
import com.climbCommunity.backend.repository.ChatRoomRepository;
import com.climbCommunity.backend.repository.MessageRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
     * 1:1 채팅방 목록 조회
     */
    public List<ChatPreviewDto> getChatList(Long userId) {
        User me = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        List<ChatRoom> rooms = chatRoomRepository.findByUser1OrUser2(me, me);

        return rooms.stream().map(room -> {
            // ✅ 상대방 찾기
            User partner = room.getUser1().getId().equals(me.getId())
                    ? room.getUser2() : room.getUser1();

            // ✅ 최근 메시지
            return messageRepository.findTopByRoomOrderByCreatedAtDesc(room)
                    .map(lastMsg -> ChatPreviewDto.builder()
                            .roomId(room.getId())
                            .userId(partner.getId())
                            .username(partner.getUsername())
                            .profileImage(partner.getProfileImage())
                            .lastMessage(lastMsg.getContent())
                            .timestamp(lastMsg.getCreatedAt().format(FORMATTER))
                            .unreadCount(0)   // TODO: 읽음 처리 로직 추가 가능
                            .online(false)    // TODO: 추후 Presence 연동
                            .build())
                    .orElseGet(() -> ChatPreviewDto.builder()
                            .roomId(room.getId())
                            .userId(partner.getId())
                            .username(partner.getUsername())
                            .profileImage(partner.getProfileImage())
                            .lastMessage("")   // 메시지가 아직 없는 방
                            .timestamp(null)
                            .unreadCount(0)
                            .online(false)
                            .build());
        }).toList();
    }
}
