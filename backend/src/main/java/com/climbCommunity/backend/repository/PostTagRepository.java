package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.PostTag;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {
    List<PostTag> findByPost(Post post);
    List<PostTag> findByTaggedUser(User user);
    boolean existsByPostAndTaggedUser(Post post, User user);
}
