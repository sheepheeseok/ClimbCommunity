package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.groupmember.GroupMemberRequestDto;
import com.climbCommunity.backend.dto.groupmember.GroupMemberResponseDto;
import com.climbCommunity.backend.entity.ClimbingGroup;
import com.climbCommunity.backend.entity.GroupMember;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.ClimbingGroupService;
import com.climbCommunity.backend.service.GroupMemberService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/group-members")
@RequiredArgsConstructor
public class GroupMemberController {
    private final GroupMemberService memberService;
    private final ClimbingGroupService groupService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<GroupMemberResponseDto> joinGroup(@RequestBody GroupMemberRequestDto dto) {
        ClimbingGroup group = groupService.getClimbingGroupById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userService.getUserById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .build();

        GroupMember savedMember = memberService.saveGroupMember(member);

        GroupMemberResponseDto response = GroupMemberResponseDto.builder()
                .id(savedMember.getId())
                .groupId(group.getId())
                .username(user.getUsername())
                .joinedAt(savedMember.getJoinedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<GroupMemberResponseDto>> getMembersByGroup(@PathVariable Long groupId) {
        List<GroupMemberResponseDto> members = memberService.getMembersByGroupId(groupId).stream()
                .map(member -> GroupMemberResponseDto.builder()
                        .id(member.getId())
                        .groupId(member.getGroup().getId())
                        .username(member.getUser().getUsername())
                        .joinedAt(member.getJoinedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(members);
    }
}
