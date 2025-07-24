package com.climbCommunity.backend.dto.group;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupCommentRequestDto {
    private String content;
    private Long parentId;
}
