package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.PostVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostVideoRepository extends JpaRepository<PostVideo, Long> {
    List<PostVideo> findByPostId(Long postId);
}
