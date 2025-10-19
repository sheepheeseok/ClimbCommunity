package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Follow;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.FollowStatus;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowee(User follower, User followee);

    @Transactional
    @Modifying
    void deleteByFollowerAndFollowee(User follower, User followee);

    List<Follow> findByFollowee(User Followee);
    List<Follow> findByFollower(User Follower);
    boolean existsByFollower_UserIdAndFollowee_UserIdAndStatus(
            String followerUserId, String followeeUserId, FollowStatus status);

    // ✅ 특정 상태(PENDING/ACCEPTED/REJECTED)로 조회
    List<Follow> findByFolloweeAndStatus(User followee, FollowStatus status);
    List<Follow> findByFollowerAndStatus(User follower, FollowStatus status);
    long countByFolloweeAndStatus(User followee, FollowStatus status);
    long countByFollowerAndStatus(User follower, FollowStatus status);

    // ✅ 팔로워와 대상자 조합으로 Follow 찾기
    Optional<Follow> findByFollowerAndFollowee(User follower, User followee);

    Optional<Follow> findByFollower_UserIdAndFollowee_UserId(String followerUserId, String followeeUserId);

    @Query("""
SELECT DISTINCT 
    CASE 
        WHEN f.follower.id = :userId THEN f.followee.id 
        ELSE f.follower.id 
    END
FROM Follow f
WHERE f.follower.id = :userId OR f.followee.id = :userId
""")
    List<Long> findAllFollowedOrFollowingIds(@Param("userId") Long userId);

    @Query("SELECT f.followee.id FROM Follow f WHERE f.follower.id = :followerId")
    List<Long> findFolloweeIdsByFollowerId(Long followerId);
}
