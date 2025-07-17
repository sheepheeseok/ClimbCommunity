package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GymRepository extends JpaRepository<Gym, Long> {
    Gym findByName(String name);
}
