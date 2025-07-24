package com.climbCommunity.backend.dto.group;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupRecruitmentRequestDto {
    private String title;
    private String content;
    private String location;
    private LocalDateTime meetDate;
    private Integer maxMembers;
}
