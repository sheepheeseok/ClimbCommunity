package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.location.Coordinate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressCacheService {

    private final RedisTemplate<String, Coordinate> coordinateRedisTemplate;

    private static final Duration TTL = Duration.ofDays(7); // 7일간 캐싱

    public Optional<Coordinate> getCachedCoordinate(String normalizedAddress) {
        return Optional.ofNullable(coordinateRedisTemplate.opsForValue().get(normalizedAddress));
    }

    public void cacheCoordinate(String normalizedAddress, Coordinate coordinate) {
        coordinateRedisTemplate.opsForValue().set(normalizedAddress, coordinate, TTL);
    }
}
