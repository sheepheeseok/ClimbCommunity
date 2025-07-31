package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.location.AddressInfo;
import com.climbCommunity.backend.dto.location.LocationVerificationResponseDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserVerifiedLocation;
import com.climbCommunity.backend.repository.UserVerifiedLocationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NaverReverseGeocodingService {

    private final UserVerifiedLocationRepository userVerifiedLocationRepository;

    @Value("${naver.reverse-url}")
    private String reverseUrl;

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 사용자 좌표 → 도로명 주소 + 동 이름 반환
     */
    public Optional<AddressInfo> reverseGeocodeFull(double latitude, double longitude) {
        Optional<JsonNode> resultsOpt = requestNaverReverseGeocode(latitude, longitude, "legalcode,roadaddr");
        if (resultsOpt.isEmpty()) return Optional.empty();

        String roadAddress = null;
        String dong = null;

        for (JsonNode result : resultsOpt.get()) {
            String name = result.get("name").asText();
            if ("roadaddr".equals(name)) {
                JsonNode land = result.get("land");
                String road = land.get("name").asText();
                String number = land.get("number1").asText();
                roadAddress = road + " " + number;
            } else if ("legalcode".equals(name)) {
                dong = result.get("region").get("area3").get("name").asText();
            }
        }

        return (roadAddress != null && dong != null)
                ? Optional.of(new AddressInfo(roadAddress, dong))
                : Optional.empty();
    }

    /**
     * 사용자 좌표 → 행정동 이름만 반환
     */
    public Optional<String> reverseGeocodeOnly(double latitude, double longitude) {
        Optional<JsonNode> resultsOpt = requestNaverReverseGeocode(latitude, longitude, "legalcode");

        if (resultsOpt.isEmpty()) return Optional.empty();

        JsonNode region = resultsOpt.get().get(0).get("region");
        if (region != null && region.has("area3")) {
            return Optional.of(region.get("area3").get("name").asText());
        }

        return Optional.empty();
    }

    /**
     * 사용자 인증용 주소 저장 및 응답 DTO 반환
     */
    public LocationVerificationResponseDto reverseGeocodeAndSave(User user, double latitude, double longitude) {
        Optional<AddressInfo> resultOpt = reverseGeocodeFull(latitude, longitude);

        if (resultOpt.isEmpty()) {
            return LocationVerificationResponseDto.builder()
                    .verified(false)
                    .dong("주소 확인 불가")
                    .verifiedAddress(null)
                    .verifiedAt(null)
                    .build();
        }

        AddressInfo info = resultOpt.get();

        UserVerifiedLocation verified = UserVerifiedLocation.builder()
                .user(user)
                .address(info.getRoadAddress())
                .dong(info.getDong())
                .createdAt(LocalDateTime.now())
                .build();

        userVerifiedLocationRepository.save(verified);

        return LocationVerificationResponseDto.builder()
                .verified(true)
                .dong(info.getDong())
                .verifiedAddress(info.getRoadAddress())
                .verifiedAt(verified.getCreatedAt())
                .build();
    }

    /**
     * 네이버 Reverse Geocode API 호출 공통 메서드
     */
    private Optional<JsonNode> requestNaverReverseGeocode(double lat, double lng, String orders) {
        String uri = UriComponentsBuilder
                .fromHttpUrl(reverseUrl)
                .queryParam("coords", lng + "," + lat)
                .queryParam("output", "json")
                .queryParam("orders", orders)
                .build(false)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
        headers.set("X-NCP-APIGW-API-KEY", clientSecret);

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(uri, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
            JsonNode results = response.getBody().get("results");

            log.info("📦 Naver ReverseGeocode 응답 ({}): {}", orders, response.getBody().toPrettyString());

            return (results != null && results.size() > 0) ? Optional.of(results) : Optional.empty();
        } catch (Exception e) {
            log.warn("❌ Naver ReverseGeocode 실패 - orders: {} - {}", orders, e.getMessage());
            return Optional.empty();
        }
    }
}
