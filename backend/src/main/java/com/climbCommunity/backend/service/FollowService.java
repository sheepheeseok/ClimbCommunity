package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.Follow;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.FollowStatus;
import com.climbCommunity.backend.repository.FollowRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * 팔로우 요청
     * 공개 계정 → 바로 ACCEPTED
     * 비공개 계정 → PENDING 상태 저장
     */
    @Transactional
    public Follow requestFollow(String followerId, String followeeId) {
        User follower = userRepository.findByUserId(followerId)
                .orElseThrow(() -> new RuntimeException("팔로워 사용자 없음"));
        User followee = userRepository.findByUserId(followeeId)
                .orElseThrow(() -> new RuntimeException("팔로우 대상 사용자 없음"));

        if (followRepository.existsByFollowerAndFollowee(follower, followee)) {
            throw new RuntimeException("이미 팔로우 요청 또는 팔로우 완료 상태");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .followee(followee)
                .status(followee.isPrivate() ? FollowStatus.PENDING : FollowStatus.ACCEPTED)
                .build();

        Follow saved = followRepository.save(follow);

        // ✅ 비공개 계정 → PENDING 상태일 경우 알림 생성 (중복 체크 포함)
        if (follow.getStatus() == FollowStatus.PENDING) {
            notificationService.createFollowRequestNotification(
                    followee.getId(),     // 알림 받을 사람
                    follower.getId(),     // 알림 발생자
                    saved.getId(),        // followId (targetId로 씀)
                    follower.getUserId() + "님이 팔로우 요청을 보냈습니다."
            );
        }

        return saved;
    }

    /**
     * 팔로우 요청 승인
     */
    @Transactional
    public void acceptFollow(Long followId) {
        Follow follow = followRepository.findById(followId)
                .orElseThrow(() -> new RuntimeException("팔로우 요청 없음"));

        follow.setStatus(FollowStatus.ACCEPTED);

        // ✅ 기존 FOLLOW_REQUEST 알림 삭제
        notificationService.deleteFollowRequestNotification(
                follow.getFollowee().getId(), // 알림 받는 사람
                follow.getFollower().getId(), // 알림 보낸 사람
                follow.getId()                // followId
        );

        // ✅ 원한다면 "팔로우가 승인되었습니다" 알림을 보낼 수도 있음
    }

    /**
     * 팔로우 요청 거절
     */
    @Transactional
    public void rejectFollow(Long followId) {
        Follow follow = followRepository.findById(followId)
                .orElseThrow(() -> new RuntimeException("팔로우 요청 없음"));

        // ✅ FOLLOW_REQUEST 알림 삭제
        notificationService.deleteFollowRequestNotification(
                follow.getFollowee().getId(),
                follow.getFollower().getId(),
                follow.getId()
        );

        followRepository.delete(follow);
    }

    /**
     * 언팔로우
     */
    @Transactional
    public void unfollow(String followerId, String followeeId) {
        User follower = userRepository.findByUserId(followerId)
                .orElseThrow(() -> new RuntimeException("팔로워 사용자 없음"));
        User followee = userRepository.findByUserId(followeeId)
                .orElseThrow(() -> new RuntimeException("팔로우 대상 사용자 없음"));

        followRepository.deleteByFollowerAndFollowee(follower, followee);
    }

    /**
     * 승인된 팔로워 목록
     */
    public List<User> getFollowers(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        return followRepository.findByFolloweeAndStatus(user, FollowStatus.ACCEPTED) // ✅
                .stream()
                .map(Follow::getFollower)
                .toList();
    }

    public List<User> getFollowing(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        return followRepository.findByFollowerAndStatus(user, FollowStatus.ACCEPTED) // ✅
                .stream()
                .map(Follow::getFollowee)
                .toList();
    }

    /**
     * 팔로우 여부 확인 (ACCEPTED만 true)
     */
    public boolean isFollowing(String followerUserId, String followeeUserId) {
        return followRepository.existsByFollower_UserIdAndFollowee_UserIdAndStatus(
                followerUserId, followeeUserId, FollowStatus.ACCEPTED
        );
    }

    public String getFollowStatus(String followerUserId, String followeeUserId) {
        return followRepository.findByFollower_UserIdAndFollowee_UserId(followerUserId, followeeUserId)
                .map(f -> f.getStatus().name()) // "PENDING" or "ACCEPTED"
                .orElse("NONE"); // 아예 팔로우 요청 없음
    }

    /**
     * 내가 받은 팔로우 요청 (승인 대기중)
     */
    public List<Follow> getPendingRequests(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        return followRepository.findByFolloweeAndStatus(user, FollowStatus.PENDING);
    }

    @Transactional
    public Optional<Follow> findById(Long followId) {
        return followRepository.findById(followId);
    }

    @Transactional
    public void cancelFollowRequest(String followerUserId, String followeeUserId) {
        User follower = userRepository.findByUserId(followerUserId)
                .orElseThrow(() -> new EntityNotFoundException("팔로워 없음"));
        User followee = userRepository.findByUserId(followeeUserId)
                .orElseThrow(() -> new EntityNotFoundException("팔로이 없음"));

        Follow follow = followRepository.findByFollowerAndFollowee(follower, followee)
                .orElseThrow(() -> new EntityNotFoundException("팔로우 요청 없음"));

        if (follow.getStatus() == FollowStatus.PENDING) {
            // 알림 삭제
            notificationService.deleteFollowRequestNotification(
                    followee.getId(),
                    follower.getId(),
                    follow.getId()
            );
            // 요청 삭제
            followRepository.delete(follow);
        } else {
            throw new RuntimeException("취소할 수 없는 상태");
        }
    }
}
