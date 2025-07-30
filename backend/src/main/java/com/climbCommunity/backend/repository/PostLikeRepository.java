package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.PostLike;
import com.climbCommunity.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByUserAndPost(User user, Post post);
    Optional<PostLike> findByUserAndPost(User user, Post post);
    long countByPost(Post post);
    List<PostLike> findByUser_Id(Long userId);
    int countByUser_Id(Long userId);
}
