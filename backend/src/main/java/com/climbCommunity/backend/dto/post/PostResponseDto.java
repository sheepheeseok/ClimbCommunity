package com.climbCommunity.backend.dto.post;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.Category;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Builder
public class PostResponseDto {
    private Long id;
    private String content;
    private Category category;
    private String username;
    private String status;
    private String createdAt;
    private String updatedAt;
    private List<String> imageUrls;
    private List<String> videoUrls;

    public static PostResponseDto fromEntity(Post post) {
        return PostResponseDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .category(post.getCategory())
                .username(post.getUser().getUsername())
                .status(post.getStatus().name())
                .createdAt(format(post.getCreatedAt()))
                .updatedAt(post.getUpdatedAt() != null ? format(post.getUpdatedAt()) : null)
                .imageUrls(post.getImages().stream()
                        .map(img -> img.getImageUrl())
                        .toList())
                .videoUrls(post.getVideos().stream()
                        .map(video -> video.getVideoUrl())
                        .toList())
                .build();
    }

    private static String format(LocalDateTime time) {
        return time.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
