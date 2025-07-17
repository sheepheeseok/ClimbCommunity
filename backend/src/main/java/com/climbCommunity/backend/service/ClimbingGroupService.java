package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.ClimbingGroup;
import com.climbCommunity.backend.repository.ClimbingGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClimbingGroupService {
    private ClimbingGroupRepository climbingGroupRepository;

    public ClimbingGroup saveClimbingGroup(ClimbingGroup group) {
        return climbingGroupRepository.save(group);
    }

    public List<ClimbingGroup> getAllGroups() {
        return climbingGroupRepository.findAll();
    }

    public Optional<ClimbingGroup> getClimbingGroupById(Long id) {
        return climbingGroupRepository.findById(id);
    }

    public void deleteClimbingGroup(Long id) {
        climbingGroupRepository.deleteById(id);
    }
}
