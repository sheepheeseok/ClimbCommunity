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
        // 1️⃣ 로그인 사용자
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        // 2️⃣ 내가 팔로우한 유저 ID 목록
        List<Long> followingIds = followRepository.findFolloweeIdsByFollowerId(currentUser.getId());
        if (followingIds.isEmpty()) followingIds = List.of(-1L);

        // 3️⃣ 팔로잉 유저 게시물 (최신순 3개)
        List<Post> followingPosts = postRepository.findTop3ByUserIdInOrderByCreatedAtDesc(followingIds);

        // 4️⃣ 팔로우 안 한 유저의 게시물
        List<Post> otherPosts = postRepository.findRecommendedPostsExcluding(followingIds, currentUser.getId());

        // 5️⃣ 랜덤 5개 중 2개 선택
        Collections.shuffle(otherPosts);
        List<Post> randomPosts = otherPosts.stream().limit(2).collect(Collectors.toList());

        // 6️⃣ 피드 병합
        List<Post> merged = new ArrayList<>();
        merged.addAll(followingPosts);
        merged.addAll(randomPosts);

        // 7️⃣ S3 URL 포함 변환
        return merged.stream()
                .map(post -> PostResponseDto.fromEntityWithS3(post, s3Service))
                .collect(Collectors.toList());
    }
}
