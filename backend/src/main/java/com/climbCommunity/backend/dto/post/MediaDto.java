package com.climbCommunity.backend.dto.post;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MediaDto {
    private String url;       // S3 접근 가능한 파일 URL
    private String type;      // "image" | "video"
    private int orderIndex;   // 업로드 순서

    public MediaDto(String type, String url, int orderIndex) {
        this.type = type;
        this.url = url;
        this.orderIndex = orderIndex;
    }
}
