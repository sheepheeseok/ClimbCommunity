package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findTopByRoomOrderByCreatedAtDesc(ChatRoom room);
}
