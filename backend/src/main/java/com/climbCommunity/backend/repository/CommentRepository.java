package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Comment;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.CommentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @EntityGraph(attributePaths = {"user", "parentComment", "replies"})
    Optional<Comment> findByIdAndStatus(Long postId, CommentStatus status);

    @EntityGraph(attributePaths = {"user", "parentComment", "replies"})
    List<Comment> findByPostIdAndStatus(Long postId, CommentStatus status);

    Page<Comment> findByPost_IdAndStatusAndParentCommentIsNull(
            Long postId, CommentStatus status, Pageable pageable);
    List<Comment> findByParentComment_IdAndStatus(Long parentCommentId, CommentStatus commentStatus);
    List<Comment> findByUser_Id(Long userId);
    int countByUser_Id(Long userId);
    void deleteByPost(Post post);
    long countByPost_Id(Long postId);
}
