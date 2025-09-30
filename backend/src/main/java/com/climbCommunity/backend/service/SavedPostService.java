package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.SavedPost;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.PostRepository;
import com.climbCommunity.backend.repository.SavedPostRepository;
import com.climbCommunity.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean toggleSave(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        return savedPostRepository.findByUserAndPost(user, post)
                .map(saved -> {
                    savedPostRepository.delete(saved);
                    return false; // 삭제됨
                })
                .orElseGet(() -> {
                    SavedPost newSaved = SavedPost.builder()
                            .user(user)
                            .post(post)
                            .build();
                    savedPostRepository.save(newSaved);
                    return true; // 저장됨
                });
    }

    @Transactional(readOnly = true)
    public boolean isSaved(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        return savedPostRepository.existsByUserAndPost(user, post);
    }

    @Transactional(readOnly = true)
    public List<SavedPost> getSavedPosts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return savedPostRepository.findAllByUser(user);
    }
}
