package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Comment;
import com.climbCommunity.backend.entity.GroupComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupCommentRepository extends JpaRepository<GroupComment, Long> {
    List<GroupComment> findByGroupRecruitmentIdOrderByCreatedAtAsc(Long groupId);
    List<GroupComment> findByUser_Id(Long userId);
    int countByUser_Id(Long userId);
}
