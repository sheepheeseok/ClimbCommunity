package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    int countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
}
