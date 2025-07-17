package com.climbCommunity.backend.service;


import com.climbCommunity.backend.entity.PostLike;
import com.climbCommunity.backend.repository.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;

    public PostLike savePostLike(PostLike postLike) {
        return postLikeRepository.save(postLike);
    }

    public void deletePostLike(Long id) {
        postLikeRepository.deleteById(id);
    }

    public int countLikesByPostId(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }

    public boolean hasUserLiked(Long postId, Long userId) {
        return postLikeRepository.existsByPostIdAndUserId(postId, userId);
    }
}
