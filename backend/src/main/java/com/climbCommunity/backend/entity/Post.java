package com.climbCommunity.backend.entity;

import com.climbCommunity.backend.entity.enums.Category;
import com.climbCommunity.backend.entity.enums.PostStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> images = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostVideo> videos = new ArrayList<>();

    private String location; // 암장 위치
    private LocalDate date;  // 방문 날짜

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "post_tried_problems", joinColumns = @JoinColumn(name = "post_id"))
    @MapKeyColumn(name = "color")
    @Column(name = "count")
    private Map<String, Integer> triedProblems = new HashMap<>();

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "post_completed_problems", joinColumns = @JoinColumn(name = "post_id"))
    @MapKeyColumn(name = "color")
    @Column(name = "count")
    private Map<String, Integer> completedProblems = new HashMap<>();

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = PostStatus.ACTIVE;
        }
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
