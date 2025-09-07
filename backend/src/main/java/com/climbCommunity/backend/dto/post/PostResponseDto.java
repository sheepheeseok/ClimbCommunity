package com.climbCommunity.backend.dto.post;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.Category;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private List<String> imageUrls;
    private List<String> videoUrls;
    private String thumbnailUrl;
    private String location;
    private Map<String, Integer> completedProblems;
    private long commentCount;

    public static PostResponseDto fromEntity(Post post) {
        return fromEntity(post, 0L); // 기본 commentCount = 0
    }

    public static PostResponseDto fromEntity(Post post, long commentCount) {
        return PostResponseDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .category(post.getCategory())
                .username(post.getUser().getUsername())
                .status(post.getStatus().name())
                .userId(post.getUser().getUserId())
                .createdAt(format(post.getCreatedAt()))
                .updatedAt(post.getUpdatedAt() != null ? format(post.getUpdatedAt()) : null)
                .imageUrls(post.getImages().stream()
                        .map(img -> img.getImageUrl())
                        .toList())
                .videoUrls(post.getVideos().stream()
                        .map(video -> video.getVideoUrl())
                        .toList())
                .thumbnailUrl(post.getThumbnailUrl())       // ✅ 썸네일 반영
                .location(post.getLocation())               // ✅ 위치 반영
                .completedProblems(post.getCompletedProblems()) // ✅ 완등 문제 수 반영
                .commentCount(commentCount)
                .build();
    }

    private static String format(LocalDateTime time) {
        return time.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
