package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.SavedPost;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    Optional<SavedPost> findByUserAndPost(User user, Post post);

    boolean existsByUserAndPost(User user, Post post);

    void deleteByUserAndPost(User user, Post post);

    List<SavedPost> findAllByUser(User user);
}
