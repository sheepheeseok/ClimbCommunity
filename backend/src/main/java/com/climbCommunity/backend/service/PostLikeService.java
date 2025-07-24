package com.climbCommunity.backend.service;


import com.climbCommunity.backend.entity.Notification;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.PostLike;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.PostLikeRepository;
import com.climbCommunity.backend.repository.PostRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void likePost(String userId, Long postId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 없음"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글 없음"));

        if (postLikeRepository.existsByUserAndPost(user, post)) {
            return;
        }

        postLikeRepository.save(PostLike.builder()
                .user(user)
                .post(post)
                .build());
        }

    @Transactional
    public void unlikePost(String userId, Long postId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 없음"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글 없음"));

        postLikeRepository.findByUserAndPost(user, post)
                .ifPresent(postLikeRepository::delete);
    }

    public long countLikes(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글 없음"));
        return postLikeRepository.countByPost(post);
    }

    public boolean hasUserLiked(String userId, Long postId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 없음"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글 없음"));
        return postLikeRepository.existsByUserAndPost(user, post);
    }
}
