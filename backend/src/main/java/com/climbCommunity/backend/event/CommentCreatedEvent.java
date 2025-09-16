package com.climbCommunity.backend.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class CommentCreatedEvent extends ApplicationEvent {
    private final Long postId;     // 댓글 단 게시물
    private final Long commenterId; // 댓글 작성자
    private final Long postOwnerId; // 게시물 주인

    public CommentCreatedEvent(Object source, Long postId, Long commenterId, Long postOwnerId) {
        super(source);
        this.postId = postId;
        this.commenterId = commenterId;
        this.postOwnerId = postOwnerId;
    }
}