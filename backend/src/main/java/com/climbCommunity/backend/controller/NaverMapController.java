package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.service.NaverMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/naver")
@RequiredArgsConstructor
public class NaverMapController {

    private final NaverMapService naverMapService;

    @GetMapping("/search")
    public ResponseEntity<?> searchPlaces(@RequestParam String query) {
        return ResponseEntity.ok(naverMapService.searchPlaces(query));
    }
}
