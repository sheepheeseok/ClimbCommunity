package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.UserVerifiedLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserVerifiedLocationRepository extends JpaRepository<UserVerifiedLocation, Long> {
    boolean existsByUserIdAndAddress(Long userId, String address);
    List<UserVerifiedLocation> findByUserIdOrderByCreatedAtDesc(Long userId);
}