package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.ChatRoomRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;


    public ChatRoom createOrGetRoom(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // 항상 작은 id가 user1, 큰 id가 user2
        final User first  = user1.getId() < user2.getId() ? user1 : user2;
        final User second = user1.getId() < user2.getId() ? user2 : user1;

        return chatRoomRepository.findByUser1AndUser2(first, second)
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder()
                        .user1(first)
                        .user2(second)
                        .build()));
    }
}
