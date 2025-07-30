package com.climbCommunity.backend.dto.location;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class VerifiedLocationDto {
    private String address;
    private LocalDateTime verifiedAt;
}
