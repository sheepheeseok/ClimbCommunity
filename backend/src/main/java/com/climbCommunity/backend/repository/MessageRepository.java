package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.ChatRoom;

import com.climbCommunity.backend.entity.Message;
import com.climbCommunity.backend.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findTopByRoomOrderByCreatedAtDesc(ChatRoom room);
    List<Message> findByRoomOrderByCreatedAtAsc(ChatRoom room);

    @Query("SELECT COUNT(m) FROM Message m " +
            "WHERE m.room = :room AND m.sender <> :me AND m.isRead = false")
    long countUnreadMessages(@Param("room") ChatRoom room, @Param("me") User me);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.room = :room AND m.sender <> :me AND m.isRead = false")
    int markMessagesAsRead(@Param("room") ChatRoom room, @Param("me") User me);
}

