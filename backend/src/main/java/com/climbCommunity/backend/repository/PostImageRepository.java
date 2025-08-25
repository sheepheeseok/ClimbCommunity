package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    List<PostImage> findByPostId(Long postId);
    void deleteByPost(Post post);
}
