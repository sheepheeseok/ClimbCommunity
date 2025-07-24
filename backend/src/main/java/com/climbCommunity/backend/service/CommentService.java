package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.comment.CommentRequestDto;
import com.climbCommunity.backend.dto.comment.CommentResponseDto;
import com.climbCommunity.backend.entity.*;
import com.climbCommunity.backend.entity.enums.CommentStatus;
import com.climbCommunity.backend.entity.enums.LikeType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final CommentLikeRepository commentLikeRepository;

    // 댓글 생성
    public CommentResponseDto saveComment(Long postId, String userId, CommentRequestDto dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 존재 하지 않습니다."));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

        Comment parentComment = null;
        if (dto.getParentCommentId() != null) {
            parentComment = commentRepository.findByIdAndStatus(dto.getParentCommentId(), CommentStatus.ACTIVE)
                    .orElseThrow(() -> new EntityNotFoundException("부모 댓글이 존재하지 않습니다."));
        }

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(dto.getContent())
                .parentComment(parentComment)
                .status(CommentStatus.ACTIVE)
                .build();

        return CommentResponseDto.from(commentRepository.save(comment), commentLikeRepository, userId);
    }

    // 댓글 수정
    public CommentResponseDto updateComment(Long commentId, String userId, CommentRequestDto dto, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        if (!isAdmin && !comment.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인만 댓글을 수정할 수 있습니다.");
        }

        comment.setContent(dto.getContent());
        return CommentResponseDto.from(commentRepository.save(comment), commentLikeRepository, userId);
    }

    // 댓글 삭제
    public void deleteComment(Long commentId, String userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        if (!isAdmin && !comment.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인만 댓글을 삭제할 수 있습니다.");
        }

        comment.setStatus(CommentStatus.DELETED);
        commentRepository.save(comment);
    }

    // 댓글 트리 조회
    public Page<CommentResponseDto> getCommentTreeByPostId(Long postId, int page, int size, String currentUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));

        Page<Comment> parentComments = commentRepository.findByPost_IdAndStatusAndParentCommentIsNull(
                postId, CommentStatus.ACTIVE, pageable);

        return parentComments.map(comment -> {
            CommentResponseDto dto = CommentResponseDto.from(comment, commentLikeRepository, currentUserId);

            List<Comment> replies = commentRepository.findByParentComment_IdAndStatus(
                    comment.getId(), CommentStatus.ACTIVE);

            List<CommentResponseDto> replyDtos = replies.stream()
                    .map(reply -> CommentResponseDto.from(reply, commentLikeRepository, currentUserId))
                    .toList();

            dto.setReplies(replyDtos);
            return dto;
        });
    }

    // 댓글 신고
    public void reportComment(Long commentId, String userId, String reason) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

        Report report = Report.builder()
                .targetType(TargetType.COMMENT)
                .targetId(commentId)
                .user(user)
                .reason(reason)
                .build();

        reportRepository.save(report);
    }

    // 댓글 좋아요 추가
    @Transactional
    public void addLike(Long commentId, String userId, LikeType type) {
        if (!commentLikeRepository.existsByUser_UserIdAndComment_IdAndType(userId, commentId, type)) {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

            CommentLike like = CommentLike.builder()
                    .user(user)
                    .comment(comment)
                    .type(type)
                    .build();

            commentLikeRepository.save(like);
        }
    }

    // 댓글 좋아요 취소
    @Transactional
    public void removeLike(Long commentId, String userId, LikeType type) {
        commentLikeRepository.deleteByUser_UserIdAndComment_IdAndType(userId, commentId, type);
    }

    // 사용자가 좋아요 눌렀는지 확인
    public boolean hasUserLiked(Long commentId, String userId, LikeType type) {
        return commentLikeRepository.existsByUser_UserIdAndComment_IdAndType(userId, commentId, type);
    }
}
