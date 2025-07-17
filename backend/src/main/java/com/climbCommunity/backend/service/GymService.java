package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.Gym;
import com.climbCommunity.backend.repository.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GymService {
    private final GymRepository gymRepository;

    public Gym saveGym(Gym gym) {
        return gymRepository.save(gym);
    }

    public List<Gym> getAllGyms() {
        return gymRepository.findAll();
    }

    public Optional<Gym> getGymById(Long id) {
        return gymRepository.findById(id);
    }

    public void deleteGym(Long id) {
        gymRepository.deleteById(id);
    }
}
