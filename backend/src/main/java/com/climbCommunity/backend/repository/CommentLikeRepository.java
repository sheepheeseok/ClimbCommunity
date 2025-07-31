package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.CommentLike;
import com.climbCommunity.backend.entity.enums.LikeType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    // 특정 댓글에 대한 좋아요/싫어요 개수
    long countByComment_IdAndType(Long commentId, LikeType type);

    // 특정 유저가 특정 댓글에 좋아요/싫어요 눌렀는지
    boolean existsByUser_UserIdAndComment_IdAndType(String userId, Long commentId, LikeType type);

    // 특정 유저의 특정 댓글 좋아요/싫어요 삭제
    @Transactional
    @Modifying
    void deleteByUser_UserIdAndComment_IdAndType(String userId, Long commentId, LikeType type);

    List<CommentLike> findByUser_Id(Long userId);
    int countByUser_Id(Long userId);
}