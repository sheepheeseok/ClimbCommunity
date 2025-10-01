package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.notification.NotificationResponseDto;
import com.climbCommunity.backend.dto.notification.NotificationSocketMessage;
import com.climbCommunity.backend.entity.Comment;
import com.climbCommunity.backend.entity.Notification;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.event.CommentCreatedEvent;
import com.climbCommunity.backend.repository.CommentRepository;
import com.climbCommunity.backend.repository.NotificationRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // 전체 알림 조회
    public List<NotificationResponseDto> getAllNotifications(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(notification -> {
                    Long postId = null;
                    Long commentId = null;
                    if (notification.getTargetType() == TargetType.COMMENT) {
                        commentId = notification.getTargetId();
                        postId = commentRepository.findById(commentId)
                                .map(comment -> comment.getPost().getId())
                                .orElse(null);
                    } else if (notification.getTargetType() == TargetType.POST) {
                        postId = notification.getTargetId();
                    }
                    return NotificationResponseDto.from(notification, postId, commentId);
                })
                .collect(Collectors.toList());
    }

    // 일반 알림 생성 (중복 체크 없음)
    public void createNotification(
            Long recipientUserId,
            Long actorUserId,
            NotificationType type,
            TargetType targetType,
            Long targetId,
            String message
    ) {
        User recipient = userRepository.findById(recipientUserId)
                .orElseThrow(() -> new EntityNotFoundException("알림 받을 사용자를 찾을 수 없습니다."));
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new EntityNotFoundException("행위자를 찾을 수 없습니다."));

        Notification notification = Notification.builder()
                .user(recipient)
                .actor(actor)
                .type(type)
                .targetType(targetType)
                .targetId(targetId)
                .message(message)
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        NotificationSocketMessage socketMessage = new NotificationSocketMessage(
                actor.getUserId(),
                actor.getUsername(),
                actor.getProfileImage(),
                message,
                type.name(),
                targetType != null ? targetType.name() : null,
                targetId
        );

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + recipient.getUserId(),
                socketMessage
        );
    }

    // 팔로우 요청 알림 생성 (중복 방지)
    public void createFollowRequestNotification(
            Long recipientUserId,
            Long actorUserId,
            Long targetId,
            String message
    ) {
        boolean exists = notificationRepository.existsByUser_IdAndActor_IdAndTypeAndTargetTypeAndTargetId(
                recipientUserId,
                actorUserId,
                NotificationType.FOLLOW_REQUEST,
                TargetType.USER,
                targetId
        );

        if (!exists) {
            createNotification(
                    recipientUserId,
                    actorUserId,
                    NotificationType.FOLLOW_REQUEST,
                    TargetType.USER,
                    targetId,
                    message
            );
        }
    }

    // 팔로우 요청 알림 삭제
    @Transactional
    public void deleteFollowRequestNotification(Long recipientId, Long actorId, Long followId) {
        notificationRepository.deleteByUser_IdAndActor_IdAndTypeAndTargetTypeAndTargetId(
                recipientId,
                actorId,
                NotificationType.FOLLOW_REQUEST,
                TargetType.USER,
                followId
        );
    }

    // 팔로우 취소 알림 제거
    public void deleteFollowNotification(String followerUserId, String followeeUserId) {
        User follower = userRepository.findByUserId(followerUserId)
                .orElseThrow(() -> new EntityNotFoundException("팔로워를 찾을 수 없습니다."));
        User followee = userRepository.findByUserId(followeeUserId)
                .orElseThrow(() -> new EntityNotFoundException("팔로우 당한 사용자를 찾을 수 없습니다."));

        notificationRepository.findByUser_IdAndTypeAndTargetTypeAndTargetId(
                followee.getId(),
                NotificationType.FOLLOW,
                TargetType.USER,
                follower.getId()
        ).ifPresent(notificationRepository::delete);
    }

    // 좋아요 취소 시 알림 제거
    public void deleteLikeNotification(Long recipientUserId, Long postId) {
        notificationRepository.findByUser_IdAndTypeAndTargetTypeAndTargetId(
                recipientUserId,
                NotificationType.LIKE,
                TargetType.POST,
                postId
        ).ifPresent(notificationRepository::delete);
    }

    // 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("알림을 찾을 수 없습니다."));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // 모든 알림 읽음 처리
    public void markAllAsRead(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    // 댓글 작성 이벤트 → 알림 생성
    @EventListener
    public void handleCommentCreated(CommentCreatedEvent event) {
        String commentContent = commentRepository.findById(event.getCommentId())
                .map(Comment::getContent)
                .orElse("");

        String preview = commentContent.length() > 30
                ? commentContent.substring(0, 30) + "..."
                : commentContent;

        createNotification(
                event.getPostOwnerId(),
                event.getCommenterId(),
                NotificationType.COMMENT,
                TargetType.COMMENT,
                event.getCommentId(),
                "님이 게시글에 댓글을 남겼습니다. " + preview
        );
    }

    // 댓글 삭제 시 알림 제거
    public void deleteCommentNotification(Long postOwnerId, Long commenterId, Long commentId) {
        notificationRepository.deleteByUser_IdAndActor_IdAndTypeAndTargetTypeAndTargetId(
                postOwnerId,
                commenterId,
                NotificationType.COMMENT,
                TargetType.COMMENT,
                commentId
        );
    }
}
