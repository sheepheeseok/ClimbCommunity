package com.climbCommunity.backend.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class CommentCreatedEvent extends ApplicationEvent {
    private final Long commentId;    // ✅ 댓글 ID
    private final Long commenterId;  // 댓글 작성자
    private final Long postOwnerId; // 게시물 주인
    private final String commentContent;

    public CommentCreatedEvent(Object source, Long commentId, Long commenterId, Long postOwnerId, String commentContent) {
        super(source);
        this.commentId = commentId;
        this.commenterId = commenterId;
        this.postOwnerId = postOwnerId;
        this.commentContent = commentContent;
    }
}