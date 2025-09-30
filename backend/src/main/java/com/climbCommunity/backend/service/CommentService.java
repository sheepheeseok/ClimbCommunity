package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.comment.CommentRequestDto;
import com.climbCommunity.backend.dto.comment.CommentResponseDto;
import com.climbCommunity.backend.dto.useractivity.MyCommentDto;
import com.climbCommunity.backend.entity.*;
import com.climbCommunity.backend.entity.enums.CommentStatus;
import com.climbCommunity.backend.entity.enums.LikeType;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.event.CommentCreatedEvent;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.ApplicationEventPublisher;
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
    private final ApplicationEventPublisher eventPublisher;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    // 댓글 생성
    public CommentResponseDto saveComment(Long postId, Long userId, CommentRequestDto dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자 없음"));

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

        Comment savedComment = commentRepository.save(comment);

        // ✅ 댓글 생성 후 이벤트 발행
        if (!post.getUser().getId().equals(user.getId())) { // 자기 글에 단 댓글은 알림 X
            eventPublisher.publishEvent(
                    new CommentCreatedEvent(
                            this,
                            savedComment.getId(),
                            user.getId(),        // 댓글 작성자
                            post.getUser().getId(), // 게시물 작성자
                            savedComment.getContent()
                    )
            );
        }

        return CommentResponseDto.from(savedComment, commentLikeRepository, userId);
    }

    // 댓글 수정
    public CommentResponseDto updateComment(Long commentId, Long userId, CommentRequestDto dto, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        if (!isAdmin && !comment.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("본인만 댓글을 수정할 수 있습니다.");
        }

        comment.setContent(dto.getContent());
        return CommentResponseDto.from(commentRepository.save(comment), commentLikeRepository, userId);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        if (!isAdmin && !comment.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("본인만 댓글을 삭제할 수 있습니다.");
        }

        // 댓글 알림 제거 호출
        notificationService.deleteCommentNotification(
                comment.getPost().getUser().getId(),  // 알림 받는 사람 (게시글 작성자)
                comment.getUser().getId(),            // 알림 발생자 (댓글 작성자)
                comment.getId()                       // targetId = commentId
        );

        commentRepository.delete(comment);
    }

    // 댓글 트리 조회 (재귀)
    public Page<CommentResponseDto> getCommentTreeByPostId(Long postId, int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Comment> parents = commentRepository.findByPost_IdAndStatusAndParentCommentIsNull(
                postId, CommentStatus.ACTIVE, pageable
        );

        return parents.map(c -> CommentResponseDto.from(c, commentLikeRepository, currentUserId));
    }


    // 댓글 신고
    public void reportComment(Long commentId, Long userId, String reason) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
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
    public void addLike(Long commentId, Long userId, LikeType type) {
        if (!commentLikeRepository.existsByUser_IdAndComment_IdAndType(userId, commentId, type)) {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));
            User user = userRepository.findById(userId)
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
    public void removeLike(Long commentId, Long userId, LikeType type) {
        commentLikeRepository.deleteByUser_IdAndComment_IdAndType(userId, commentId, type);
    }

    // 사용자가 좋아요 눌렀는지 확인
    public boolean hasUserLiked(Long commentId, Long userId, LikeType type) {
        return commentLikeRepository.existsByUser_IdAndComment_IdAndType(userId, commentId, type);
    }

    // 내가 쓴 댓글
    public List<MyCommentDto> getMyComments(Long userId) {
        return commentRepository.findByUser_Id(userId).stream()
                .map(comment -> MyCommentDto.builder()
                        .commentId(comment.getId())
                        .content(comment.getContent())
                        .postId(comment.getPost().getId())
                        .createdAt(comment.getCreatedAt().toString())
                        .build())
                .toList();
    }

    public int countByUser(Long userId) {
        return commentRepository.countByUser_Id(userId);
    }
}
