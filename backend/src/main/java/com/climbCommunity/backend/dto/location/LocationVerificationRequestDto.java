package com.climbCommunity.backend.dto.location;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationVerificationRequestDto {
    private String selectedAddress;
    private double latitude;
    private double longitude;
}
