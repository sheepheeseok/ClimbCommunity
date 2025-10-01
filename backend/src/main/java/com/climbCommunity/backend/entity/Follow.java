package com.climbCommunity.backend.entity;

import com.climbCommunity.backend.entity.enums.FollowStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "follows", uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "followee_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followee_id", nullable = false)
    private User followee;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private FollowStatus status; // PENDING, ACCEPTED, REJECTED

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (status == null) {
            status = FollowStatus.PENDING;
        }
    }
}
