package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.CommentLike;
import com.climbCommunity.backend.entity.enums.LikeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    Optional<CommentLike> findByUser_IdAndCommentId(Long userId, Long commentId);
    long countBycommentIdAndType(Long commentId, LikeType type);
}
