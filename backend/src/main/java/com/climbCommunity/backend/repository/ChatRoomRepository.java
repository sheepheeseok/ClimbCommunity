package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.ChatRoom;
import com.climbCommunity.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByAccountAndPartner(User account, User partner);
    List<ChatRoom> findByAccountOrPartner(User account, User partner);
}