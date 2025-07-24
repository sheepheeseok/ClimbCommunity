package com.climbCommunity.backend.entity;

import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
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

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String message;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TargetType targetType;

    private Long targetId;

    private Boolean isRead;

    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
}
