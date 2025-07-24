package com.climbCommunity.backend.dto.group;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupRecruitmentResponseDto {
    private Long id;
    private String title;
    private String content;
    private String location;
    private LocalDateTime meetDate;
    private Integer maxMembers;
    private Integer currentMembers;
    private String status;
    private LocalDateTime createdAt;
}
