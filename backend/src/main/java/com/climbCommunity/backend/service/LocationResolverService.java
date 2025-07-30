package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.location.Coordinate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationResolverService {

    private final NaverMapService naverMapService;

    public Coordinate resolveAddressToCoordinate(String rawAddress) {
        return naverMapService.geocodeAddress(rawAddress)
                .orElseThrow(() -> new IllegalArgumentException("❗ 주소를 정확히 입력해주세요. 예: 서울특별시 송파구 백제고분로 45길 25"));
    }
}


