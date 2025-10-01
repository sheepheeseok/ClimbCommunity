package com.climbCommunity.backend.entity;
import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Role;
import com.climbCommunity.backend.entity.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String userId;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    private String website;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    private String profileImage;

    @Column(length = 20)
    private String tel;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Grade grade;

    @Column(length = 255)
    private String bio;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = true)
    private LocalDate birthdate;

    private boolean isPrivate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime deletedAt;

    public boolean canRestore() {
        return this.status == Status.deleted &&
                deletedAt != null &&
                deletedAt.isAfter(LocalDateTime.now().minusDays(30));
    }

    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        this.grade = Grade.White;
        this.status = Status.active;
        this.createdAt = LocalDateTime.now();
        this.isPrivate = false;
    }
}
