package com.climbCommunity.backend.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false, length = 255)
    private String imageUrl;
}
