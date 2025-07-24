package com.climbCommunity.backend.dto.group;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupRecruitmentDetailDto {
    private Long id;
    private String title;
    private String content;
    private String location;
    private String username;
    private Integer maxMembers;
    private Integer currentMembers;
    private String status;
    private LocalDateTime meetDate;
    private LocalDateTime createdAt;
}
