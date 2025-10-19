package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.entity.enums.PostStatus;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId);
    Page<Post> findByCategory(Category category, Pageable pageable);
    int countByUser_Id(Long userId);
    List<Post> findByUser(User user);
    // ✅ 팔로우한 유저들의 최신 게시물 (최대 3개)
    @Query("""
        SELECT p FROM Post p
        WHERE p.user.id IN :ids
        ORDER BY p.createdAt DESC
    """)
    List<Post> findTop3ByUserIdInOrderByCreatedAtDesc(List<Long> ids);

    // ✅ 팔로우하지 않은 유저 게시물 (랜덤 섞기용)
    @Query("""
        SELECT p FROM Post p
        WHERE p.user.id NOT IN :ids
        AND p.user.id <> :userId
        ORDER BY p.createdAt DESC
    """)
    List<Post> findRecommendedPostsExcluding(List<Long> ids, Long userId);

    @Query("SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.images " +
            "LEFT JOIN FETCH p.videos " +
            "WHERE p.id = :postId")
    Optional<Post> findByIdWithMedia(@Param("postId") Long postId);
}
