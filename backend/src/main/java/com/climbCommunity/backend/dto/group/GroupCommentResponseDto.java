package com.climbCommunity.backend.dto.group;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupCommentResponseDto {
    private Long id;
    private String content;
    private String username;
    private String userId;
    private LocalDateTime createdAt;
    private List<GroupCommentResponseDto> replies; // 대댓글 목록
    private int likeCount;
    private boolean likedByMe;
}
