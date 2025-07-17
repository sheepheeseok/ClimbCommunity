package com.climbCommunity.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.active;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        active, banned, deleted
    }
}
