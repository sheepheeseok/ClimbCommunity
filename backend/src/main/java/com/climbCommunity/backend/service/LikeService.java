package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.useractivity.LikedCommentDto;
import com.climbCommunity.backend.dto.useractivity.LikedGroupCommentDto;
import com.climbCommunity.backend.dto.useractivity.LikedPostDto;
import com.climbCommunity.backend.repository.CommentLikeRepository;
import com.climbCommunity.backend.repository.GroupCommentLikeRepository;
import com.climbCommunity.backend.repository.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final PostLikeRepository postLikeRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final GroupCommentLikeRepository groupCommentLikeRepository;

    public List<LikedPostDto> getLikedPosts(Long userId) {
        return postLikeRepository.findByUser_Id(userId).stream()
                .map(like -> LikedPostDto.builder()
                        .postId(like.getPost().getId())
                        .title(like.getPost().getTitle())
                        .likedAt(like.getCreatedAt().toString())
                        .build())
                .toList();
    }

    public List<LikedCommentDto> getLikedComments(Long userId) {
        return commentLikeRepository.findByUser_Id(userId).stream()
                .map(like -> LikedCommentDto.builder()
                        .commentId(like.getComment().getId())
                        .preview(like.getComment().getContent().substring(0, Math.min(20, like.getComment().getContent().length())))
                        .likedAt(like.getCreatedAt().toString())
                        .build())
                .toList();
    }

    public List<LikedGroupCommentDto> getLikedGroupComments(Long userId) {
        return groupCommentLikeRepository.findByUser_Id(userId).stream()
                .map(like -> LikedGroupCommentDto.builder()
                        .groupCommentId(like.getComment().getId())
                        .preview(like.getComment().getContent().substring(0, Math.min(20, like.getComment().getContent().length())))
                        .likedAt(like.getLikedAt().toString())
                        .build())
                .toList();
    }

    public int countLikedPosts(Long userId) {
        return postLikeRepository.countByUser_Id(userId);
    }

    public int countLikedComments(Long userId) {
        return commentLikeRepository.countByUser_Id(userId);
    }

    public int countLikedGroupComments(Long userId) {
        return groupCommentLikeRepository.countByUser_Id(userId);
    }
}
