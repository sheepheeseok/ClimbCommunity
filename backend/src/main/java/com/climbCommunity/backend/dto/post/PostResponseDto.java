package com.climbCommunity.backend.dto.post;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.Category;
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
    private String thumbnailUrl;  // ✅ 대표 썸네일만 유지
    private String location;
    private Map<String, Integer> completedProblems;
    private long commentCount;
    private long likeCount;
    private boolean savedByMe; // ✅ 북마크 여부

    /**
     * savedByMe 없는 기본 변환
     */
    public static PostResponseDto fromEntity(Post post) {
        return fromEntity(post, 0L, 0L, false);
    }

    /**
     * 댓글수/좋아요수만 포함
     */
    public static PostResponseDto fromEntity(Post post, long commentCount, long likeCount) {
        return fromEntity(post, commentCount, likeCount, false);
    }

    /**
     * 댓글수/좋아요수 + 저장여부 포함
     */
    public static PostResponseDto fromEntity(Post post, long commentCount, long likeCount, boolean savedByMe) {
        List<MediaDto> mediaList = new ArrayList<>();

        // 이미지 매핑
        mediaList.addAll(
                post.getImages().stream()
                        .map(img -> MediaDto.builder()
                                .url(img.getImageUrl())
                                .type("image")
                                .orderIndex(img.getOrderIndex())
                                .build()
                        ).toList()
        );

        // 비디오 매핑
        mediaList.addAll(
                post.getVideos().stream()
                        .map(video -> MediaDto.builder()
                                .url(video.getVideoUrl())
                                .type("video")
                                .orderIndex(video.getOrderIndex())
                                .build()
                        ).toList()
        );

        // 정렬 (orderIndex 기준)
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
                .savedByMe(savedByMe) // ✅ 북마크 여부 반영
                .build();
    }

    private static String format(LocalDateTime time) {
        return time.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
