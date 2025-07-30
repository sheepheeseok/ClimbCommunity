package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.location.Coordinate;
import com.climbCommunity.backend.dto.location.LocationVerificationRequestDto;
import com.climbCommunity.backend.dto.location.LocationVerificationResponseDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserVerifiedLocation;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.repository.UserVerifiedLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocationVerificationService {

    private final NaverMapService naverMapService;
    private final NaverReverseGeocodingService reverseGeocodingService;
    private final UserRepository userRepository;
    private final UserVerifiedLocationRepository verifiedLocationRepository;

    private static final double THRESHOLD_METERS = 1000.0;
    private final UserVerifiedLocationRepository userVerifiedLocationRepository;

    @Transactional
    public LocationVerificationResponseDto verifyLocation(Long userId, LocationVerificationRequestDto dto) {
        String selectedAddress = dto.getSelectedAddress();
        double userLat = dto.getLatitude();
        double userLng = dto.getLongitude();

        // ✅ 주소 → 좌표 변환
        Coordinate addressCoord = naverMapService.geocodeAddress(selectedAddress)
                .orElseThrow(() -> new IllegalArgumentException("❌ 주소를 정확히 입력해주세요. 예: 서울특별시 송파구 백제고분로 45길 25"));

        // ✅ 거리 계산
        double distance = calculateDistance(userLat, userLng, addressCoord.getLatitude(), addressCoord.getLongitude());
        log.info("📏 실제 거리 계산 결과: {}m", distance);

        if (distance > THRESHOLD_METERS) {
            throw new IllegalArgumentException("❌ 현재 위치와 선택한 주소의 거리가 너무 멉니다.");
        }

        // ✅ 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // ✅ 중복 인증 확인
        boolean alreadyVerified = verifiedLocationRepository.existsByUserIdAndAddress(userId, selectedAddress);
        if (alreadyVerified) {
            log.info("✅ 이미 인증된 주소: {}", selectedAddress);

            // 이미 인증된 경우에도 dong은 다시 추출해서 반환
            String dong = reverseGeocodingService.reverseGeocodeOnly(userLat, userLng).orElse("미확인");

            return LocationVerificationResponseDto.builder()
                    .verified(true)
                    .dong(dong)
                    .verifiedAddress(selectedAddress)
                    .verifiedAt(LocalDateTime.now())
                    .build();
        }

        // ✅ 실제 위치 좌표로부터 도로명 주소 및 dong 추출 및 저장
        return reverseGeocodingService.reverseGeocodeAndSave(user, userLat, userLng);
    }

    /**
     * Haversine 공식으로 거리 계산 (미터 단위)
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        int R = 6371000; // 지구 반지름 (m)
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<LocationVerificationResponseDto> getVerifiedLocations(Long userId) {
        List<UserVerifiedLocation> locations = userVerifiedLocationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return locations.stream()
                .map(loc -> LocationVerificationResponseDto.builder()
                        .verified(true)  // 이미 인증된 기록이므로 true 고정
                        .dong(loc.getDong())
                        .verifiedAddress(loc.getAddress())
                        .verifiedAt(loc.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
