package com.climbCommunity.backend.service;

import com.climbCommunity.backend.entity.GroupMember;
import com.climbCommunity.backend.repository.GroupMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupMemberService {
    private GroupMemberRepository groupMemberRepository;

    public GroupMember saveGroupMember(GroupMember member) {
        return groupMemberRepository.save(member);
    }

    public List<GroupMember> getMembersByGroupId(Long groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }
}
