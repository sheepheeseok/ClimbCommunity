package com.climbCommunity.backend.entity;

import com.climbCommunity.backend.entity.enums.ApplicationStatus;
import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "group_applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"recruitment_id", "user_id"})
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruitment_id", nullable = false)
    private GroupRecruitment recruitment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private LocalDateTime createdAt;

    public void approve() {
        this.status = ApplicationStatus.ACCEPTED;
    }

    public void reject() {
        this.status = ApplicationStatus.REJECTED;
    }

    public boolean isPending() {
        return this.status == ApplicationStatus.PENDING;
    }

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
