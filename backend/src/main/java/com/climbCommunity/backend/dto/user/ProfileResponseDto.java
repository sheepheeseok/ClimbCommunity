package com.climbCommunity.backend.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ProfileResponseDto {
    private Long id;
    private String userId;
    private String username;
    private String profileImage;
    private String grade;
    private String bio;

    private StatsDto stats;
    private List<PostThumbnailDto> posts;
    private List<UserLiteDto> followers;
    private List<UserLiteDto> following;

    @Getter
    @Setter
    @Builder
    public static class StatsDto {
        private long posts;
        private long followers;
        private long following;
    }

    @Getter
    @Setter
    @Builder
    public static class PostThumbnailDto {
        private Long id;
        private String thumbnailUrl;
    }
}
