package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.ClimbingGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClimbingGroupRepository extends JpaRepository<ClimbingGroup, Long> {
}
