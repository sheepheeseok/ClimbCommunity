package com.climbCommunity.backend.dto.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 게시물에 태그된 사용자 정보 DTO
 * 프론트엔드에서는 @username, 프로필이미지 표시용
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaggedUserDto {
    private String userId;       // 비즈니스용 ID (예: climber123)
    private String username;     // 사용자 이름 또는 닉네임
    private String profileImage; // 프로필 이미지 URL
}
