package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    // 두 유저가 동시에 포함된 방 찾기 (중복방 방지용)
    Optional<ChatRoom> findByUser1AndUser2(User user1, User user2);

    // 내가 속한 모든 방 가져오기 (채팅목록 조회용)
    List<ChatRoom> findByUser1OrUser2(User user1, User user2);
}