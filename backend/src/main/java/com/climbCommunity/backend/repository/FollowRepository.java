package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Follow;
import com.climbCommunity.backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowee(User follower, User followee);

    @Transactional
    @Modifying
    void deleteByFollowerAndFollowee(User follower, User followee);

    List<Follow> findByFollowee(User Followee);
    List<Follow> findByFollower(User Follower);
    boolean existsByFollower_UserIdAndFollowee_UserId(String followerUserId, String followeeUserId);
}
