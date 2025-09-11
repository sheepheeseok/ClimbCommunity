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
    private String status;
    private String createdAt;
    private String updatedAt;
    private List<MediaDto> mediaList;
    private String thumbnailUrl;  // ✅ 대표 썸네일만 유지
    private String location;
    private Map<String, Integer> completedProblems;
    private long commentCount;

    public static PostResponseDto fromEntity(Post post) {
        return fromEntity(post, 0L);
    }

    public static PostResponseDto fromEntity(Post post, long commentCount) {
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

        mediaList.sort(Comparator.comparingInt(MediaDto::getOrderIndex));

        return PostResponseDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .category(post.getCategory())
                .username(post.getUser().getUsername())
                .userId(post.getUser().getUserId())
                .status(post.getStatus().name())
                .createdAt(format(post.getCreatedAt()))
                .updatedAt(post.getUpdatedAt() != null ? format(post.getUpdatedAt()) : null)
                .mediaList(mediaList)  // ✅ 통합된 mediaList
                .thumbnailUrl(post.getThumbnailUrl())
                .location(post.getLocation())
                .completedProblems(post.getCompletedProblems())
                .commentCount(commentCount)
                .build();
    }

    private static String format(LocalDateTime time) {
        return time.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
