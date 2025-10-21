package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.FollowRepository;
import com.climbCommunity.backend.repository.PostRepository;
import com.climbCommunity.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service; // ✅ 추가

    public List<PostResponseDto> getFeed(Long userId) {
        List<Post> feedPosts = new ArrayList<>();

        // ⚠️ 1️⃣ 로그인하지 않은 경우 (게스트)
        if (userId == null) {
            // 전체 공개 게시물 중 최신 또는 랜덤 5개 추천
            List<Post> allPosts = postRepository.findAllByOrderByCreatedAtDesc();
            Collections.shuffle(allPosts);
            feedPosts.addAll(allPosts.stream().limit(5).collect(Collectors.toList()));
        }
        // ✅ 2️⃣ 로그인한 사용자일 때
        else {
            User currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자 없음"));

            List<Long> followingIds = followRepository.findFolloweeIdsByFollowerId(currentUser.getId());

            if (followingIds.isEmpty()) {
                // ⚠️ 팔로잉이 없으면 → 비팔로우 유저 게시물 5개
                List<Post> otherPosts = postRepository.findRecommendedPostsExcluding(List.of(-1L), currentUser.getId());
                Collections.shuffle(otherPosts);
                feedPosts.addAll(otherPosts.stream().limit(5).collect(Collectors.toList()));
            } else {
                // ✅ 팔로잉 게시물 3개
                List<Post> followingPosts = postRepository.findTop3ByUserIdInOrderByCreatedAtDesc(followingIds);
                feedPosts.addAll(followingPosts);

                // ✅ 비팔로우 게시물 중 랜덤 2개
                List<Post> otherPosts = postRepository.findRecommendedPostsExcluding(followingIds, currentUser.getId());
                Collections.shuffle(otherPosts);
                feedPosts.addAll(otherPosts.stream().limit(2).collect(Collectors.toList()));
            }
        }

        // ✅ S3 URL 포함 변환
        return feedPosts.stream()
                .map(post -> PostResponseDto.fromEntityWithS3(post, s3Service))
                .collect(Collectors.toList());
    }

}
