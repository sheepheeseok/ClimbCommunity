package com.climbCommunity.backend.dto.comment;

import com.climbCommunity.backend.entity.Comment;
import com.climbCommunity.backend.entity.enums.CommentStatus;
import com.climbCommunity.backend.entity.enums.LikeType;
import com.climbCommunity.backend.repository.CommentLikeRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
public class CommentResponseDto {
    private Long id;
    private Long userPkId;         // 작성자 PK (DB 내부 키)
    private String userId;         // 작성자 비즈니스 아이디
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

    public static CommentResponseDto from(Comment comment,
                                          CommentLikeRepository likeRepo,
                                          Long currentUserId) {
        long likeCount = likeRepo.countByComment_IdAndType(comment.getId(), LikeType.LIKE);
        long dislikeCount = likeRepo.countByComment_IdAndType(comment.getId(), LikeType.DISLIKE);

        boolean likedByMe = false;
        boolean dislikedByMe = false;

        if (currentUserId != null) { // 로그인한 사용자일 때만 체크
            likedByMe = likeRepo.existsByUser_IdAndComment_IdAndType(currentUserId, comment.getId(), LikeType.LIKE);
            dislikedByMe = likeRepo.existsByUser_IdAndComment_IdAndType(currentUserId, comment.getId(), LikeType.DISLIKE);
        }

        // 🔁 재귀적으로 자식 댓글까지 DTO로 변환
        List<CommentResponseDto> replyDtos = comment.getReplies() != null
                ? comment.getReplies().stream()
                .filter(c -> c.getStatus() == CommentStatus.ACTIVE) // 삭제 제외
                .map(child -> CommentResponseDto.from(child, likeRepo, currentUserId))
                .collect(Collectors.toList())
                : List.of();

        return CommentResponseDto.builder()
                .id(comment.getId())
                .userPkId(comment.getUser().getId())          // 🔹 PK
                .userId(comment.getUser().getUserId())        // 🔹 비즈니스 ID
                .username(comment.getUser().getUsername())
                .profileImage(comment.getUser().getProfileImage())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .likedByMe(likedByMe)
                .dislikedByMe(dislikedByMe)
                .content(comment.getStatus() == CommentStatus.DELETED
                        ? "삭제된 댓글입니다."
                        : comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .replies(replyDtos) // 🔁 트리 구조 세팅
                .build();
    }
}
