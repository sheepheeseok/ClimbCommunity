package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.GroupRecruitment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRecruitmentRepository extends JpaRepository<GroupRecruitment, Long> {
    Page<GroupRecruitment> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
}
