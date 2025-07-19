package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.PostStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);
    List<Post> findByTitleContaining(String keyword, Pageable pageable);
    List<Post> findByStatus(PostStatus status, Pageable pageable);
    List<Post> findByTitleContainingAndStatus(String keyword, PostStatus status, Pageable pageable);
}
