package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getFeed(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<PostResponseDto> feed = feedService.getFeed(userPrincipal.getId());
        return ResponseEntity.ok(feed);
    }
}
