package com.climbCommunity.backend.dto.group;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupRecruitmentSummaryDto {
    private Long id;
    private String title;
    private String location;
    private String username; // 작성자
    private Integer maxMembers;
    private Integer currentMembers;
    private String status;
    private LocalDateTime meetDate;
    private LocalDateTime createdAt;
}
