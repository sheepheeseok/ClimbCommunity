package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.CommentLike;
import com.climbCommunity.backend.entity.GroupComment;
import com.climbCommunity.backend.entity.GroupCommentLike;
import com.climbCommunity.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupCommentLikeRepository extends JpaRepository<GroupCommentLike, Long> {

    Optional<GroupCommentLike> findByCommentAndUser(GroupComment comment, User user);
    int countByComment(GroupComment comment);
    boolean existsByCommentAndUserUserId(GroupComment comment, String userId);
    List<GroupCommentLike> findByUser_Id(Long userId);
    int countByUser_Id(Long userId);
}