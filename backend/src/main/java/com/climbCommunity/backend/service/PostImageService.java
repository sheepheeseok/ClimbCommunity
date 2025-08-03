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

    public PostImage save(PostImage postImage) {
        return postImageRepository.save(postImage);
    }

    public List<PostImage> saveAll(List<PostImage> images) {
        return postImageRepository.saveAll(images);
    }

    public List<PostImage> getImagesByPostId(Long postId) {
        return postImageRepository.findByPostId(postId);
    }
}

