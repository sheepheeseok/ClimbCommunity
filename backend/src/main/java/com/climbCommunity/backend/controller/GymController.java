package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.gym.GymRequestDto;
import com.climbCommunity.backend.dto.gym.GymResponseDto;
import com.climbCommunity.backend.entity.Gym;
import com.climbCommunity.backend.service.GymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gyms")
@RequiredArgsConstructor
public class GymController {
    private final GymService gymService;

    @PostMapping
    public ResponseEntity<GymResponseDto> createGym(@RequestBody GymRequestDto dto) {
        Gym gym = Gym.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .imageUrl(dto.getImageUrl())
                .phone(dto.getPhone())
                .openHours(dto.getOpenHours())
                .websiteUrl(dto.getWebsiteUrl())
                .instagram(dto.getInstagram())
                .build();

        Gym savedGym = gymService.saveGym(gym);

        GymResponseDto response = GymResponseDto.builder()
                .id(savedGym.getId())
                .name(savedGym.getName())
                .location(savedGym.getLocation())
                .imageUrl(savedGym.getImageUrl())
                .phone(savedGym.getPhone())
                .openHours(savedGym.getOpenHours())
                .websiteUrl(savedGym.getWebsiteUrl())
                .instagram(savedGym.getInstagram())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<GymResponseDto>> getAllGyms() {
        List<GymResponseDto> gyms = gymService.getAllGyms().stream()
                .map(gym -> GymResponseDto.builder()
                        .id(gym.getId())
                        .name(gym.getName())
                        .location(gym.getLocation())
                        .imageUrl(gym.getImageUrl())
                        .phone(gym.getPhone())
                        .openHours(gym.getOpenHours())
                        .websiteUrl(gym.getWebsiteUrl())
                        .instagram(gym.getInstagram())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(gyms);
    }
}

