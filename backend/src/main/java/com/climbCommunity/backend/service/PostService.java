package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.useractivity.MyPostDto;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.entity.enums.PostStatus;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.exception.NotFoundException;
import com.climbCommunity.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Page<Post> getPostsByCategory(Category category, Pageable pageable){
        return postRepository.findByCategory(category, pageable);
    }

    // 게시글 단일 조회
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));
    }

    // 게시글 수정
    public Post updatePost(Long id, String title, String content, Category category, String currentUserId) {
        Post post = getPostById(id);

        if (!post.getUser().getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("게시글 수정 권한이 없습니다.");
        }

        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        return postRepository.save(post);
    }

    // 게시글 삭제
    public void deletePost(Long id, String currentUserId) {
        Post post = getPostById(id);

        if (!post.getUser().getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("게시글 삭제 권한이 없습니다.");
        }
        postRepository.deleteById(id);
    }

    // 관리자 전체 게시글 조회
    public Page<Post> findAllPosts(String keyword, PostStatus status, Category category, Pageable pageable) {
        if (keyword != null && status != null && category != null) {
            return postRepository.findByTitleContainingAndStatusAndCategory(keyword, status, category, pageable);
        } else if (keyword != null && status != null) {
            return postRepository.findByTitleContainingAndStatus(keyword, status, pageable);
        } else if (keyword != null) {
            return postRepository.findByTitleContaining(keyword, pageable);
        } else {
            return postRepository.findAll(pageable);
        }
    }

    // 관리자 게시글 상태 변경
    public void adminUpdatePostStatus(Long postId, PostStatus status) {
        Post post = getPostById(postId);
        post.setStatus(status);
        postRepository.save(post);
    }

    // 관리자 게시글 강제 삭제
    public void adminDeletePost(Long postId) {
        Post post = getPostById(postId);
        postRepository.delete(post);
    }

    public List<MyPostDto> getMyPosts(Long userId) {
        return postRepository.findByUserId(userId).stream()
                .map(post -> MyPostDto.builder()
                        .postId(post.getId())
                        .title(post.getTitle())
                        .category(post.getCategory().name())
                        .createdAt(post.getCreatedAt().toString())
                        .build())
                .toList();
    }

    public int countByUser(Long userId) {
        return postRepository.countByUser_Id(userId);
    }
}
