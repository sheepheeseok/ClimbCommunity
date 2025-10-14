package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.location.Coordinate;
import com.climbCommunity.backend.util.AddressNormalizer;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class NaverMapService {

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    @Value("${naver.geocode-url}")
    private String geocodeUrl;

    @Value("${naver.client-id-dev}")
    private String developersClientId;

    @Value("${naver.client-secret-dev}")
    private String developersClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final AddressNormalizer addressNormalizer;
    private final AddressCacheService addressCacheService;

    public Optional<Coordinate> geocodeAddress(String rawAddress) {
        String normalized = addressNormalizer.normalize(rawAddress);
        if (normalized.isEmpty()) {
            log.warn("입력된 주소가 정규화 결과 빈 문자열입니다.");
            return Optional.empty();
        }

        // ✅ 캐시 조회
        Optional<Coordinate> cached = addressCacheService.getCachedCoordinate(normalized);
        if (cached.isPresent()) {
            log.info("✅ Redis 캐시 HIT - {}", normalized);
            return cached;
        }

        try {
            // ✅ URI 구성
            String uri = UriComponentsBuilder
                    .fromHttpUrl(geocodeUrl)
                    .queryParam("query", normalized)
                    .build(false) // double encoding 방지
                    .toUriString();

            log.info("📡 NaverMap 요청 URI: {}", uri);

            // ✅ 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
            headers.set("X-NCP-APIGW-API-KEY", clientSecret);

            // ✅ 요청
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange(uri, HttpMethod.GET, entity, JsonNode.class);

            log.info("📦 Naver 응답: {}", response.getBody().toPrettyString());

            JsonNode addresses = response.getBody().get("addresses");
            if (addresses != null && addresses.size() > 0) {
                JsonNode first = addresses.get(0);
                Coordinate coordinate = new Coordinate(
                        first.get("y").asDouble(),
                        first.get("x").asDouble()
                );

                // ✅ 캐시 저장
                addressCacheService.cacheCoordinate(normalized, coordinate);
                log.info("✅ Redis 캐시 저장 - {} → {}", normalized, coordinate);
                return Optional.of(coordinate);
            } else {
                log.warn("❌ Naver 응답에 주소가 없음");
            }

        } catch (Exception e) {
            log.error("❌ Naver geocode API 호출 실패: {}", e.getMessage());
        }

        return Optional.empty();
    }

    public Optional<Map<String, String>> resolveAddressWithDong(String rawAddress) {
        String normalized = addressNormalizer.normalize(rawAddress);
        if (normalized.isEmpty()) {
            return Optional.empty();
        }

        try {
            String uri = UriComponentsBuilder
                    .fromHttpUrl(geocodeUrl)
                    .queryParam("query", normalized)
                    .build(false)
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
            headers.set("X-NCP-APIGW-API-KEY", clientSecret);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange(uri, HttpMethod.GET, entity, JsonNode.class);

            JsonNode addresses = response.getBody().get("addresses");
            if (addresses != null && addresses.size() > 0) {
                JsonNode first = addresses.get(0);

                String roadAddress = first.get("roadAddress").asText();
                String jibunAddress = first.get("jibunAddress").asText(); // ex: 서울 송파구 석촌동 123

                // "석촌동" 같은 동 이름만 추출
                String dong = extractDongFromAddress(jibunAddress);

                Map<String, String> result = new HashMap<>();
                result.put("roadAddress", roadAddress);
                result.put("dong", dong);

                return Optional.of(result);
            }
        } catch (Exception e) {
            log.warn("❌ 주소 + 동 이름 추출 실패: {}", e.getMessage());
        }

        return Optional.empty();
    }

    /**
     * 예: "서울 송파구 석촌동 123" → "석촌동"
     */
    private String extractDongFromAddress(String jibunAddress) {
        String[] parts = jibunAddress.split(" ");
        return parts.length >= 3 ? parts[2] : "";  // 구/동 기준
    }

    /**
     * 📍 네이버 지역 검색 API (Local Search)
     * Developers 콘솔에서 발급한 Client ID / Secret 사용
     */
    public List<Map<String, String>> searchPlaces(String query) {
        String url = "https://openapi.naver.com/v1/search/local.json";

        try {
            String uri = UriComponentsBuilder
                    .fromHttpUrl(url)
                    .queryParam("query", query)
                    .queryParam("display", 5) // 최대 5개만
                    .build(false)
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Naver-Client-Id", developersClientId);
            headers.set("X-Naver-Client-Secret", developersClientSecret);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange(uri, HttpMethod.GET, entity, JsonNode.class);

            JsonNode items = response.getBody().get("items");
            List<Map<String, String>> results = new ArrayList<>();

            if (items != null && items.size() > 0) {
                for (JsonNode item : items) {
                    Map<String, String> map = new HashMap<>();
                    map.put("title", item.get("title").asText());
                    map.put("address", item.get("address").asText());
                    map.put("roadAddress", item.get("roadAddress").asText());
                    map.put("mapx", item.get("mapx").asText());
                    map.put("mapy", item.get("mapy").asText());
                    results.add(map);
                }
            }

            return results;
        } catch (Exception e) {
            log.warn("❌ Naver Local Search API 호출 실패: {}", e.getMessage());
            return List.of();
        }
    }
}
