package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.GroupApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupApplicationRepository extends JpaRepository<GroupApplication, Long> {

    boolean existsByRecruitment_IdAndUser_UserId(Long recruitmentId, String userId);

    Optional<GroupApplication> findByRecruitment_IdAndUser_UserId(Long recruitmentId, String userId);

    List<GroupApplication> findAllByRecruitment_Id(Long recruitmentId);
    List<GroupApplication> findByUser_Id(Long userId);
    int countByUser_Id(Long userId);
}
