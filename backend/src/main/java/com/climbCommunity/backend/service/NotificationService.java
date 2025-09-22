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
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener; // ✅ 이벤트 리스너
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

    // 전체 알림 조회 (읽은 것 + 안 읽은 것 모두)
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
                        // targetId = 게시글 ID
                        postId = notification.getTargetId();
                    }

                    return NotificationResponseDto.from(notification, postId, commentId);
                })
                .collect(Collectors.toList());
    }

    // 알림 생성 및 WebSocket Push
    public void createNotification(
            Long recipientUserId, // 알림 받는 사람
            Long actorUserId,     // 알림 발생시킨 사람
            NotificationType type,
            TargetType targetType,
            Long targetId,
            String message
    ) {
        // 알림 받는 사용자 (recipient)
        User recipient = userRepository.findById(recipientUserId)
                .orElseThrow(() -> new EntityNotFoundException("알림 받을 사용자를 찾을 수 없습니다."));

        // 알림 발생시킨 사용자 (actor)
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new EntityNotFoundException("행위자를 찾을 수 없습니다."));

        Notification notification = Notification.builder()
                .user(recipient)   // 받는 사람
                .actor(actor)      // 발생시킨 사람 ✅ (Notification 엔티티에 추가 필요)
                .type(type)
                .targetType(targetType)
                .targetId(targetId)
                .message(message)
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        // WebSocket 실시간 알림 Push
        NotificationSocketMessage socketMessage = new NotificationSocketMessage(
                actor.getUserId(),                        // ✅ actor의 userId
                actor.getUsername(),                      // ✅ actor의 username
                actor.getProfileImage(),                  // ✅ actor의 프로필 이미지
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

    // 알림 생성 및 WebSocket Push (새 버전: preview 포함)
    public void createNotification(
            Long recipientUserId,
            Long actorUserId,
            NotificationType type,
            TargetType targetType,
            Long targetId,
            String message,
            String preview
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
                .preview(preview) // ✅ 댓글 내용 미리보기 저장
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        NotificationSocketMessage socketMessage = new NotificationSocketMessage(
                actor.getUserId(),
                actor.getUsername(),
                actor.getProfileImage(),
                message + " " + preview,  // ✅ 프론트로는 메시지+프리뷰 같이 전달 가능
                type.name(),
                targetType != null ? targetType.name() : null,
                targetId
        );

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + recipient.getUserId(),
                socketMessage
        );
    }


    // 팔로우 취소 시 알림 제거
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
        notifications.forEach(n -> n.setRead(true)); // ✅ 동일하게 setIsRead 사용
        notificationRepository.saveAll(notifications);
    }

    @EventListener
    public void handleCommentCreated(CommentCreatedEvent event) {
        // ✅ 댓글 내용 조회
        String commentContent = commentRepository.findById(event.getCommentId())
                .map(Comment::getContent)
                .orElse("");

        // ✅ 프리뷰 (최대 30자)
        String preview = commentContent.length() > 30
                ? commentContent.substring(0, 30) + "..."
                : commentContent;

        // ✅ Notification 저장
        createNotification(
                event.getPostOwnerId(),           // 알림 받는 사람 (게시글 작성자)
                event.getCommenterId(),           // 알림 발생자 (댓글 작성자)
                NotificationType.COMMENT,
                TargetType.COMMENT,
                event.getCommentId(),             // targetId = commentId
                "님이 게시글에 댓글을 남겼습니다.", // 고정 문구
                preview                           // 프리뷰
        );
    }
        // 댓글 삭제 시 알림 제거
        public void deleteCommentNotification (Long postOwnerId, Long commenterId, Long commentId){
            notificationRepository.deleteByUser_IdAndActor_IdAndTypeAndTargetTypeAndTargetId(
                    postOwnerId,                 // 알림 받는 사람 (게시글 주인)
                    commenterId,                 // 알림 발생자 (댓글 작성자)
                    NotificationType.COMMENT,    // 알림 타입
                    TargetType.COMMENT,          // 대상 타입
                    commentId                    // targetId = 댓글 ID
            );
        }
    }
