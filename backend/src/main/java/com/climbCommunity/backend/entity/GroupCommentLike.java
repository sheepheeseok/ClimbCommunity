package com.climbCommunity.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "group_comment_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "comment_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupCommentLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private GroupComment comment;

    @Column(nullable = false)
    private LocalDateTime likedAt;

    @PrePersist
    public void onLike() {
        this.likedAt = LocalDateTime.now();
    }
}
