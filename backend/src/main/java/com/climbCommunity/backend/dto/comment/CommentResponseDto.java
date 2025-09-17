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
    private String profileImage;
    private long likeCount;
    private long dislikeCount;
    private boolean likedByMe;
    private boolean dislikedByMe;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentResponseDto> replies;

    public static CommentResponseDto from(Comment comment, CommentLikeRepository likeRepo, String currentUserId) {
        long likeCount = likeRepo.countByComment_IdAndType(comment.getId(), LikeType.LIKE);
        long dislikeCount = likeRepo.countByComment_IdAndType(comment.getId(), LikeType.DISLIKE);

        boolean likedByMe = false;
        boolean dislikedByMe = false;

        if (currentUserId != null) { // 로그인한 사용자일 때만 체크
            likedByMe = likeRepo.existsByUser_UserIdAndComment_IdAndType(currentUserId, comment.getId(), LikeType.LIKE);
            dislikedByMe = likeRepo.existsByUser_UserIdAndComment_IdAndType(currentUserId, comment.getId(), LikeType.DISLIKE);
        }

        return CommentResponseDto.builder()
                .id(comment.getId())
                .userId(comment.getUser().getUserId())
                .username(comment.getUser().getUsername())
                .profileImage(comment.getUser().getProfileImage())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .likedByMe(likedByMe)
                .dislikedByMe(dislikedByMe)
                .content(comment.getStatus() == CommentStatus.DELETED ? "삭제된 댓글입니다." : comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .replies(new ArrayList<>())
                .build();
    }
}
