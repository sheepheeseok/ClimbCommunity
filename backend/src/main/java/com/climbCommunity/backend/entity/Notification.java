package com.climbCommunity.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private Boolean isRead;
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public enum NotificationType {
        comment, like, report, group
    }
}
