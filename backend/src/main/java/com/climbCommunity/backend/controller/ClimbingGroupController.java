package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.climbinggroup.ClimbingGroupRequestDto;
import com.climbCommunity.backend.dto.climbinggroup.ClimbingGroupResponseDto;
import com.climbCommunity.backend.entity.ClimbingGroup;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.service.ClimbingGroupService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/climbing-groups")
@RequiredArgsConstructor
public class ClimbingGroupController {
    private final ClimbingGroupService groupService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ClimbingGroupResponseDto> createGroup(@RequestBody ClimbingGroupRequestDto dto) {
        User creator = userService.getUserById(dto.getCreatorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClimbingGroup group = ClimbingGroup.builder()
                .creator(creator)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .eventDate(dto.getEventDate())
                .build();

        ClimbingGroup savedGroup = groupService.saveClimbingGroup(group);

        ClimbingGroupResponseDto response = ClimbingGroupResponseDto.builder()
                .id(savedGroup.getId())
                .creatorUsername(creator.getUsername())
                .title(savedGroup.getTitle())
                .description(savedGroup.getDescription())
                .location(savedGroup.getLocation())
                .eventDate(savedGroup.getEventDate().format(DateTimeFormatter.ISO_DATE_TIME))
                .createdAt(savedGroup.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ClimbingGroupResponseDto>> getAllGroups() {
        List<ClimbingGroupResponseDto> groups = groupService.getAllGroups().stream()
                .map(group -> ClimbingGroupResponseDto.builder()
                        .id(group.getId())
                        .creatorUsername(group.getCreator().getUsername())
                        .title(group.getTitle())
                        .description(group.getDescription())
                        .location(group.getLocation())
                        .eventDate(group.getEventDate().format(DateTimeFormatter.ISO_DATE_TIME))
                        .createdAt(group.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(groups);
    }
}