package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.review.ReviewRequestDto;
import com.climbCommunity.backend.dto.review.ReviewResponseDto;
import com.climbCommunity.backend.entity.Gym;
import com.climbCommunity.backend.entity.Review;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.GymService;
import com.climbCommunity.backend.service.ReviewService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final GymService gymService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(@RequestBody ReviewRequestDto dto) {
        Gym gym = gymService.getGymById(dto.getGymId())
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = Review.builder()
                .gym(gym)
                .user(user)
                .rating(dto.getRating())
                .content(dto.getContent())
                .build();

        Review savedReview = reviewService.saveReview(review);

        ReviewResponseDto response = ReviewResponseDto.builder()
                .id(savedReview.getId())
                .gymName(gym.getName())
                .username(user.getUsername())
                .rating(savedReview.getRating())
                .content(savedReview.getContent())
                .createdAt(savedReview.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/gym/{gymId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByGym(@PathVariable Long gymId) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsByGymId(gymId).stream()
                .map(review -> ReviewResponseDto.builder()
                        .id(review.getId())
                        .gymName(review.getGym().getName())
                        .username(review.getUser().getUsername())
                        .rating(review.getRating())
                        .content(review.getContent())
                        .createdAt(review.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(reviews);
    }
}
