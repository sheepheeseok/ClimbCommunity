package com.climbCommunity.backend.dto.location;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class LocationVerificationResponseDto {
    private boolean verified;           // 거리 기준 통과 여부 (예: 500m 이내)
    private String dong;                // '석촌동' 등 UI 표시용
    private String verifiedAddress;     // 도로명 주소 (DB 저장 주소)
    private LocalDateTime verifiedAt;   // 인증 시각
}