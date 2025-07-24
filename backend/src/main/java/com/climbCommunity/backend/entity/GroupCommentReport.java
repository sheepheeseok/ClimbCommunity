package com.climbCommunity.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "group_comment_reports",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "comment_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupCommentReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private GroupComment comment;

    @Column(nullable = false, length = 1000)
    private String reason;

    private LocalDateTime reportedAt;

    @PrePersist
    public void onReport() {
        this.reportedAt = LocalDateTime.now();
    }
}
