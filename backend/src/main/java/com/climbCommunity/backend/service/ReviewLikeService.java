package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.ReviewLike;
import com.climbCommunity.backend.repository.ReviewLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewLikeService {
    private ReviewLikeRepository reviewLikeRepository;

    public ReviewLike saveReviewLike(ReviewLike reviewLike) {
        return reviewLikeRepository.save(reviewLike);
    }

    public void deleteReviewLike(Long id) {
        reviewLikeRepository.deleteById(id);
    }

    public int countLikesByReviewId(Long reviewId) {
        return reviewLikeRepository.countByReviewId(reviewId);
    }

    public boolean hasUserLiked(Long reviewId, Long userId) {
        return reviewLikeRepository.existsByReviewIdAndUserId(reviewId, userId);
    }
}
