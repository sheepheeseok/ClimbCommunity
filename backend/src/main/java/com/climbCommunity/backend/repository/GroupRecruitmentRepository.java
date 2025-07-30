package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.GroupRecruitment;
import com.climbCommunity.backend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRecruitmentRepository extends JpaRepository<GroupRecruitment, Long> {
    Page<GroupRecruitment> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    List<GroupRecruitment> findByUserId(Long userId);
    int countByUser_Id(Long userId);
}
