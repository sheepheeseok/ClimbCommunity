package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.user.ProfileResponseDto;
import com.climbCommunity.backend.dto.user.UserLiteDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.FollowRepository;
import com.climbCommunity.backend.repository.PostRepository;
import com.climbCommunity.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final S3Service s3Service;

    @Transactional(readOnly = true)
    public ProfileResponseDto getProfile(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<ProfileResponseDto.PostThumbnailDto> posts = postRepository.findByUser(user).stream()
                .map(post -> ProfileResponseDto.PostThumbnailDto.builder()
                        .id(post.getId())
                        .thumbnailUrl(
                                post.getThumbnailUrl() != null
                                        ? s3Service.getFileUrl(post.getThumbnailUrl()) // ✅ 풀 URL 변환
                                        : null
                        )
                        .build())
                .toList();

        // 팔로워
        List<UserLiteDto> followers = followRepository.findByFollowee(user).stream()
                .map(f -> UserLiteDto.fromEntity(f.getFollower()))
                .toList();

        // 팔로잉
        List<UserLiteDto> following = followRepository.findByFollower(user).stream()
                .map(f -> UserLiteDto.fromEntity(f.getFollowee()))
                .toList();

        return ProfileResponseDto.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .grade(user.getGrade().name())
                .bio(user.getBio())
                .stats(ProfileResponseDto.StatsDto.builder()
                        .posts(posts.size())
                        .followers(followers.size())
                        .following(following.size())
                        .build())
                .posts(posts)
                .followers(followers)
                .following(following)
                .build();
    }
}

