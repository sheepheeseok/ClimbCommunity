package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByGymId(Long gymId);
    List<Review> findByUserId(Long userId);
}
