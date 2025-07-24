package com.climbCommunity.backend.dto.post;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.Category;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class PostResponseDto {
    private Long id;
    private String title;
    private String content;
    private Category category;
    private String username;
    private String status;
    private String createdAt;
    private String updatedAt;

    public static PostResponseDto fromEntity(Post post) {
        return PostResponseDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .category(post.getCategory())
                .content(post.getContent())
                .username(post.getUser().getUsername())
                .status(post.getStatus().name())
                .createdAt(post.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .updatedAt(post.getUpdatedAt() != null
                        ? post.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .build();
    }
}
