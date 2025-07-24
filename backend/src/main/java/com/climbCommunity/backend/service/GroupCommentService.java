package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.group.GroupCommentRequestDto;
import com.climbCommunity.backend.dto.group.GroupCommentResponseDto;
import com.climbCommunity.backend.entity.*;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupCommentService {
    private final GroupCommentRepository commentRepository;
    private final GroupRecruitmentRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupCommentLikeRepository likeRepository;
    private final GroupCommentReportRepository reportRepository;
    private final NotificationService notificationService;

    // 댓글 생성 (대댓글 포함)
    @Transactional
    public void addComment(Long groupId, String userId, GroupCommentRequestDto dto) {
        GroupRecruitment group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("모집글이 없습니다."));
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 없습니다."));

        GroupComment parent = null;
        if (dto.getParentId() != null) {
            parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("부모 댓글이 없습니다."));
        }

        GroupComment comment = GroupComment.builder()
                .groupRecruitment(group)
                .user(user)
                .parent(parent)
                .content(dto.getContent())
                .build();

        commentRepository.save(comment);

        // 알림: 작성자 ≠ 댓글 단 사람
        User author = parent != null ? parent.getUser() : group.getUser();
        if (!author.getUserId().equals(userId)) {
            notificationService.createNotification(
                    author.getId(),
                    NotificationType.COMMENT,
                    TargetType.GROUP_RECRUITMENT,
                    group.getId(),
                    user.getUsername() + " 님이 댓글을 달았습니다."
            );
        }
    }

    // 댓글 목록 조회 (대댓글 포함)
    @Transactional(readOnly = true)
    public List<GroupCommentResponseDto> getComments(Long groupId, String currentUserId) {
        List<GroupComment> comments = commentRepository.findByGroupRecruitmentIdOrderByCreatedAtAsc(groupId);

        Map<Long, GroupCommentResponseDto> commentMap = new LinkedHashMap<>();

        for (GroupComment comment : comments) {
            GroupCommentResponseDto dto = GroupCommentResponseDto.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .userId(comment.getUser().getUserId())
                    .username(comment.getUser().getUsername())
                    .createdAt(comment.getCreatedAt())
                    .likeCount(likeRepository.countByComment(comment))
                    .likedByMe(likeRepository.existsByCommentAndUserUserId(comment, currentUserId))
                    .replies(new ArrayList<>())
                    .build();

            if (comment.getParent() == null) {
                commentMap.put(comment.getId(), dto);
            } else {
                GroupCommentResponseDto parentDto = commentMap.get(comment.getParent().getId());
                if (parentDto != null) {
                    parentDto.getReplies().add(dto);
                }
            }
        }
        return new ArrayList<>(commentMap.values());
    }


    // 댓글 수정
    @Transactional
    public void updateComment(Long commentId, String userId, String content) {
        GroupComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        if (!comment.isAuthor(userId)) {
            throw new AccessDeniedException("본인의 댓글만 수정할 수 있습니다.");
        }

        comment.setContent(content);  // 변경 감지로 수정됨
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long commentId, String userId, boolean isAdmin) {
        GroupComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 존재하지 않습니다."));

        if (!isAdmin && !comment.isAuthor(userId)) {
            throw new AccessDeniedException("본인만 댓글을 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }

    // 댓글 좋아요 토글
    @Transactional
    public void toggleLike(Long commentId, String userId) {
        GroupComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 없습니다."));
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 없습니다."));

        Optional<GroupCommentLike> existing = likeRepository.findByCommentAndUser(comment, user);
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
        } else {
            likeRepository.save(GroupCommentLike.builder()
                    .comment(comment)
                    .user(user)
                    .build());

            // 알림
            if (!comment.getUser().getUserId().equals(userId)) {
                notificationService.createNotification(
                        comment.getUser().getId(),
                        NotificationType.LIKE,
                        TargetType.COMMENT,
                        comment.getId(),
                        user.getUsername() + " 님이 댓글에 좋아요를 눌렀습니다."
                );
            }
        }
    }

    // 댓글 신고
    @Transactional
    public void reportComment(Long commentId, String userId, String reason) {
        GroupComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글이 없습니다."));
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 없습니다."));

        boolean alreadyReported = reportRepository.existsByCommentIdAndUserUserId(commentId, userId);
        if (alreadyReported) throw new IllegalStateException("이미 신고한 댓글입니다.");

        reportRepository.save(GroupCommentReport.builder()
                .comment(comment)
                .user(user)
                .reason(reason)
                .build());
    }
}
