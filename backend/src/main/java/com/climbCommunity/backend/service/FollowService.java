package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.Follow;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.FollowRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public void follow(String followerId, String followeeId) {
        User follower = userRepository.findByUserId(followerId)
                .orElseThrow(() -> new RuntimeException("팔로워 사용자 없음"));
        User followee = userRepository.findByUserId(followeeId)
                .orElseThrow(() -> new RuntimeException("팔로우 대상 사용자 없음"));

        if(followRepository.existsByFollowerAndFollowee(follower, followee)) {
            throw new RuntimeException("이미 팔로우한 사용자");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .followee(followee)
                .build();

        followRepository.save(follow);
    }

    @Transactional
    public void unfollow(String followerId, String followeeId) {
        User follower = userRepository.findByUserId(followerId)
                .orElseThrow(() -> new RuntimeException("팔로워 사용자 없음"));
        User followee = userRepository.findByUserId(followeeId)
                .orElseThrow(() -> new RuntimeException("팔로우 대상 사용자 없음"));

        followRepository.deleteByFollowerAndFollowee(follower, followee);
    }

    public List<User> getFollowers(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        return followRepository.findByFollowee(user)
                .stream()
                .map(Follow::getFollower)
                .toList();
    }

    public List<User> getFollowing(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        return followRepository.findByFollower(user)
                .stream()
                .map(Follow::getFollowee)
                .toList();
    }

    public boolean isFollowing(String followerUserId, String followeeUserId) {
        return followRepository.existsByFollower_UserIdAndFollowee_UserId(followerUserId, followeeUserId);
    }
}
