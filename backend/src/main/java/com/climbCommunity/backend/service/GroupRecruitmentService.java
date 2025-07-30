package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.group.GroupRecruitmentDetailDto;
import com.climbCommunity.backend.dto.group.GroupRecruitmentRequestDto;
import com.climbCommunity.backend.dto.group.GroupRecruitmentResponseDto;
import com.climbCommunity.backend.dto.group.GroupRecruitmentSummaryDto;
import com.climbCommunity.backend.dto.useractivity.MyPostDto;
import com.climbCommunity.backend.dto.useractivity.MyRecruitmentDto;
import com.climbCommunity.backend.entity.GroupRecruitment;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.repository.GroupRecruitmentRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupRecruitmentService {

    private final UserRepository userRepository;
    private final GroupRecruitmentRepository groupRecruitmentRepository;

    @Transactional
    public GroupRecruitmentResponseDto createRecruitment(String userId, GroupRecruitmentRequestDto dto) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        GroupRecruitment recruitment = GroupRecruitment.builder()
                .user(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .location(dto.getLocation())
                .meetDate(dto.getMeetDate())
                .maxMembers(dto.getMaxMembers())
                .build();

        GroupRecruitment saved = groupRecruitmentRepository.save(recruitment);

        return GroupRecruitmentResponseDto.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .content(saved.getContent())
                .location(saved.getLocation())
                .meetDate(saved.getMeetDate())
                .maxMembers(saved.getMaxMembers())
                .currentMembers(saved.getCurrentMembers())
                .status(saved.getStatus().name())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public Page<GroupRecruitmentSummaryDto> getRecruitmentList(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<GroupRecruitment> recruitments;

        if (keyword == null || keyword.isBlank()) {
            recruitments = groupRecruitmentRepository.findAll(pageable);
        } else {
            recruitments = groupRecruitmentRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        }

        return recruitments.map(recruitment -> GroupRecruitmentSummaryDto.builder()
                .id(recruitment.getId())
                .title(recruitment.getTitle())
                .location(recruitment.getLocation())
                .username(recruitment.getUser().getUsername())
                .maxMembers(recruitment.getMaxMembers())
                .currentMembers(recruitment.getCurrentMembers())
                .status(recruitment.getStatus().name())
                .meetDate(recruitment.getMeetDate())
                .createdAt(recruitment.getCreatedAt())
                .build());
    }

    @Transactional(readOnly = true)
    public GroupRecruitmentDetailDto getRecruitmentDetail(Long id) {
        GroupRecruitment recruitment = groupRecruitmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("모집글이 없습니다."));

        return GroupRecruitmentDetailDto.builder()
                .id(recruitment.getId())
                .title(recruitment.getTitle())
                .content(recruitment.getContent())
                .location(recruitment.getLocation())
                .username(recruitment.getUser().getUsername())
                .maxMembers(recruitment.getMaxMembers())
                .currentMembers(recruitment.getCurrentMembers())
                .status(recruitment.getStatus().name())
                .meetDate(recruitment.getMeetDate())
                .createdAt(recruitment.getCreatedAt())
                .build();
    }

    @Transactional
    public void updateRecruitment(String userId, Long id, GroupRecruitmentRequestDto dto) {
        GroupRecruitment recruitment = groupRecruitmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("모집글을 찾을 수 없습니다."));

        if (!recruitment.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("수정 권한이 없습니다.");
        }

        recruitment.setTitle(dto.getTitle());
        recruitment.setContent(dto.getContent());
        recruitment.setLocation(dto.getLocation());
        recruitment.setMeetDate(dto.getMeetDate());
        recruitment.setMaxMembers(dto.getMaxMembers());
    }

    @Transactional
    public void deleteRecruitment(String userId, Long id) {
        GroupRecruitment recruitment = groupRecruitmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("모집글을 찾을 수 없습니다."));

        if (!recruitment.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }

        groupRecruitmentRepository.delete(recruitment);
    }

    public List<MyRecruitmentDto> getMyRecruitment(Long userId) {
        return groupRecruitmentRepository.findByUserId(userId).stream()
                .map(groupPost -> MyRecruitmentDto.builder()
                        .groupPostId(groupPost.getId())
                        .title(groupPost.getTitle())
                        .status(groupPost.getStatus().name())
                        .createdAt(groupPost.getCreatedAt().toString())
                        .build())
                .toList();
    }

    public int countByUser(Long userId) {
        return groupRecruitmentRepository.countByUser_Id(userId);
    }
}
