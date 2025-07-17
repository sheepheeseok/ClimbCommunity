package com.climbCommunity.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gyms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gym {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 255)
    private String location;

    private String imageUrl;
    private String phone;
    private String openHours;
    private String websiteUrl;
    private String instagram;
}
