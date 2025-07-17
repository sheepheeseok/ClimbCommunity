package com.climbCommunity.backend.dto.gym;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GymResponseDto {
    private Long id;
    private String name;
    private String location;
    private String imageUrl;
    private String phone;
    private String openHours;
    private String websiteUrl;
    private String instagram;
}
