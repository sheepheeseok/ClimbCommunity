package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.entity.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);
    Page<Post> findByCategory(Category category, Pageable pageable);
    int countByUser_Id(Long userId);
    List<Post> findByUser(User user);
}
