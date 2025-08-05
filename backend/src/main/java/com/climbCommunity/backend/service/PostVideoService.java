package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.PostVideo;
import com.climbCommunity.backend.repository.PostVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostVideoService {

    private final PostVideoRepository postVideoRepository;

    public PostVideo save(PostVideo postVideo) {
        return postVideoRepository.save(postVideo);
    }

    public List<PostVideo> saveAll(List<PostVideo> videos) {
        return postVideoRepository.saveAll(videos);
    }

    public List<PostVideo> getVideosByPostId(Long postId) {
        return postVideoRepository.findByPostId(postId);
    }
}

