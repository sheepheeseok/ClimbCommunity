package com.climbCommunity.backend.dto.gym;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GymRequestDto {
    private String name;
    private String location;
    private String imageUrl;
    private String phone;
    private String openHours;
    private String websiteUrl;
    private String instagram;
}
