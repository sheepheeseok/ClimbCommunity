package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.review.ReviewRequestDto;
import com.climbCommunity.backend.dto.reviewlike.ReviewLikeRequestDto;
import com.climbCommunity.backend.dto.reviewlike.ReviewLikeResponseDto;
import com.climbCommunity.backend.entity.Review;
import com.climbCommunity.backend.entity.ReviewLike;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.ReviewLikeService;
import com.climbCommunity.backend.service.ReviewService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review-likes")
@RequiredArgsConstructor
public class ReviewLikeController {
    private final ReviewLikeService reviewLikeService;
    private final ReviewService reviewService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ReviewLikeResponseDto> likeReview(@RequestBody ReviewLikeRequestDto dto) {
        Review review = reviewService.getReviewById(dto.getReviewId())
                .orElseThrow(() -> new RuntimeException("Review not found"));
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewLikeService.hasUserLiked(dto.getReviewId(), dto.getUserId())) {
            throw new RuntimeException("User already liked this review");
        }

        ReviewLike like = ReviewLike.builder()
                .review(review)
                .user(user)
                .build();

        ReviewLike savedLike = reviewLikeService.saveReviewLike(like);

        ReviewLikeResponseDto response = ReviewLikeResponseDto.builder()
                .id(savedLike.getId())
                .reviewId(savedLike.getReview().getId())
                .userId(savedLike.getUser().getId())
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unlikeReview(@PathVariable Long id) {
        reviewLikeService.deleteReviewLike(id);
        return ResponseEntity.noContent().build();
    }
}
