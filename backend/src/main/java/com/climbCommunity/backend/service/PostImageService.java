package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.PostImage;
import com.climbCommunity.backend.repository.PostImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostImageService {
    private final PostImageRepository postImageRepository;
    
    public PostImage savePostImage(PostImage postImage) {
        return postImageRepository.save(postImage);
    }
    
    public List<PostImage> getImagesByPostId(Long postId) {
        return postImageRepository.findByPostId(postId);
    }
}
