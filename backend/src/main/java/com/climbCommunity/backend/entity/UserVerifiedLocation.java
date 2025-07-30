package com.climbCommunity.backend.entity;

import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_verified_locations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "address"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVerifiedLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String dong;  // 예: "석촌동"

    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

