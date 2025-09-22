package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.ChatRoomRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatRoom createOrGetRoom(Long accountId, Long partnerId) {
        User account = userRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + accountId));
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + partnerId));

        // 양방향 체크
        return chatRoomRepository.findByAccountAndPartner(account, partner)
                .or(() -> chatRoomRepository.findByAccountAndPartner(partner, account))
                .orElseGet(() -> chatRoomRepository.save(
                        ChatRoom.builder()
                                .account(account)
                                .partner(partner)
                                .build()
                ));
    }

    @Transactional(readOnly = true)
    public List<ChatRoom> getMyRooms(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        // ✅ 내가 account 이든 partner 이든 모두 포함
        return chatRoomRepository.findByAccountOrPartner(user, user);
    }

}

