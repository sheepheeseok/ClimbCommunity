package com.climbCommunity.backend.dto.post;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.dto.post.TaggedUserDto;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.service.S3Service;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class PostResponseDto {
    private Long id;
    private String content;
    private Category category;
    private String username;
    private String userId;
    private String profileImage;
    private String status;
    private String createdAt;
    private String updatedAt;
    private List<MediaDto> mediaList;

    private List<TaggedUserDto> taggedUsers;

    private String thumbnailUrl;  // ✅ 대표 썸네일만 유지
    private String location;
    private Map<String, Integer> completedProblems;
    private long commentCount;
    private long likeCount;
    private boolean savedByMe; // ✅ 북마크 여부

    public static PostResponseDto fromEntity(Post post) {
        return fromEntity(post, 0L, 0L, false);
    }

    public static PostResponseDto fromEntity(Post post, long commentCount, long likeCount) {
        return fromEntity(post, commentCount, likeCount, false);
    }

    public static PostResponseDto fromEntity(Post post, long commentCount, long likeCount, boolean savedByMe) {
        // ✅ 기본 변환 (S3 경로가 아닌 raw 경로 사용)
        List<MediaDto> mediaList = new ArrayList<>();

        mediaList.addAll(
                post.getImages().stream()
                        .map(img -> MediaDto.builder()
                                .url(img.getImageUrl())
                                .type("image")
                                .orderIndex(img.getOrderIndex())
                                .build()
                        ).toList()
        );

        mediaList.addAll(
                post.getVideos().stream()
                        .map(video -> MediaDto.builder()
                                .url(video.getVideoUrl())
                                .type("video")
                                .orderIndex(video.getOrderIndex())
                                .build()
                        ).toList()
        );

        mediaList.sort(Comparator.comparingInt(MediaDto::getOrderIndex));

        return PostResponseDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .category(post.getCategory())
                .username(post.getUser().getUsername())
                .userId(post.getUser().getUserId())
                .status(post.getStatus().name())
                .profileImage(post.getUser().getProfileImage())
                .createdAt(format(post.getCreatedAt()))
                .updatedAt(post.getUpdatedAt() != null ? format(post.getUpdatedAt()) : null)
                .mediaList(mediaList)
                .thumbnailUrl(post.getThumbnailUrl())
                .location(post.getLocation())
                .completedProblems(post.getCompletedProblems())
                .commentCount(commentCount)
                .likeCount(likeCount)
                .savedByMe(savedByMe)
                .build();
    }

    public static PostResponseDto fromEntityWithS3(Post post, S3Service s3Service) {
        // ✅ S3 full URL 변환 버전 (FeedService 등에서 사용)
        List<MediaDto> mediaList = new ArrayList<>();

        mediaList.addAll(
                post.getImages().stream()
                        .map(img -> MediaDto.builder()
                                .url(s3Service.getFileUrl(img.getImageUrl()))
                                .type("image")
                                .orderIndex(img.getOrderIndex())
                                .build()
                        ).toList()
        );

        mediaList.addAll(
                post.getVideos().stream()
                        .map(video -> MediaDto.builder()
                                .url(s3Service.getFileUrl(video.getVideoUrl()))
                                .type("video")
                                .orderIndex(video.getOrderIndex())
                                .build()
                        ).toList()
        );

        mediaList.sort(Comparator.comparingInt(MediaDto::getOrderIndex));

        return PostResponseDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .category(post.getCategory())
                .username(post.getUser().getUsername())
                .userId(post.getUser().getUserId())
                .status(post.getStatus().name())
                .profileImage(post.getUser().getProfileImage())
                .createdAt(format(post.getCreatedAt()))
                .updatedAt(post.getUpdatedAt() != null ? format(post.getUpdatedAt()) : null)
                .mediaList(mediaList)
                .thumbnailUrl(post.getThumbnailUrl() != null ? s3Service.getFileUrl(post.getThumbnailUrl()) : null)
                .location(post.getLocation())
                .completedProblems(post.getCompletedProblems())
                .commentCount(0L)
                .likeCount(0L)
                .savedByMe(false)
                .build();
    }

    private static String format(LocalDateTime time) {
        return time.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
