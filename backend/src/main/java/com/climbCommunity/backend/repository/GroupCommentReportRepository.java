package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.GroupCommentReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupCommentReportRepository extends JpaRepository<GroupCommentReport, Long> {

    boolean existsByCommentIdAndUserUserId(Long commentId, String userId);


}
