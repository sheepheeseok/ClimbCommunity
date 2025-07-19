package com.climbCommunity.backend.dto.comment;

import com.climbCommunity.backend.entity.Comment;
import com.climbCommunity.backend.entity.enums.CommentStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.climbCommunity.backend.entity.enums.LikeType;
import com.climbCommunity.backend.repository.CommentLikeRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
public class CommentResponseDto {
    private Long id;
    private String userId;
    private String username;
    private long likeCount;
    private long dislikeCount;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentResponseDto> replies;

    public static CommentResponseDto from(Comment comment, CommentLikeRepository likeRepo) {
        long likeCount = likeRepo.countBycommentIdAndType(comment.getId(), LikeType.LIKE);
        long dislikeCount = likeRepo.countBycommentIdAndType(comment.getId(), LikeType.DISLIKE);

        return CommentResponseDto.builder()
                .id(comment.getId())
                .userId(comment.getUser().getUserId())
                .username(comment.getUser().getUsername())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .content(comment.getStatus() == CommentStatus.DELETED ? "삭제된 댓글입니다." : comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .replies(new ArrayList<>())
                .build();
    }
}
