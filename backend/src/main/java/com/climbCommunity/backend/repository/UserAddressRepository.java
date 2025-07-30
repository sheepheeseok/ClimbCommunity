package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    // 특정 유저의 주소 목록
    List<UserAddress> findByUserId(Long userId);

    // 인증된 주소 목록
    List<UserAddress> findByUserIdAndIsVerifiedTrueOrderByCreatedAtDesc(Long userId);

    // 대표 주소
    Optional<UserAddress> findByUserIdAndIsPrimaryTrue(Long userId);
}
