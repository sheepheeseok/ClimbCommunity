package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.group.GroupApplicationResponseDto;
import com.climbCommunity.backend.entity.GroupApplication;
import com.climbCommunity.backend.entity.GroupRecruitment;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.ApplicationStatus;
import com.climbCommunity.backend.entity.enums.NotificationType;
import com.climbCommunity.backend.entity.enums.TargetType;
import com.climbCommunity.backend.exception.AccessDeniedException;
import com.climbCommunity.backend.repository.GroupApplicationRepository;
import com.climbCommunity.backend.repository.GroupRecruitmentRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupApplicationService {

    private final GroupRecruitmentRepository recruitmentRepository;
    private final UserRepository userRepository;
    private final GroupApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    @Transactional
    public void apply(Long recruitmentId, String userId) {
        GroupRecruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new EntityNotFoundException("모집글이 존재하지 않습니다."));

        if(recruitment.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 모집글에는 신청할 수 없습니다.");
        }

        if(applicationRepository.existsByRecruitment_IdAndUser_UserId(recruitmentId, userId)) {
            throw new IllegalStateException("이미 신청한 모집글입니다.");
        }

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

        GroupApplication application = GroupApplication.builder()
                .recruitment(recruitment)
                .user(user)
                .status(ApplicationStatus.PENDING)
                .build();

        applicationRepository.save(application);

        notificationService.createNotification(
                recruitment.getUser().getId(),
                NotificationType.JOIN_REQUEST,
                TargetType.GROUP_RECRUITMENT,
                recruitmentId,
                user.getUsername() + "님이 모집글에 참여 신청했습니다."
        );
    }

    @Transactional
    public void cancel(Long recruitmentId, String userId) {
        GroupApplication application = applicationRepository.findByRecruitment_IdAndUser_UserId(recruitmentId, userId)
                .orElseThrow(() -> new EntityNotFoundException("신청 내역이 존재하지 않습니다."));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("수락되거나 거절된 신청은 취소할 수 없습니다.");
        }

        applicationRepository.delete(application);
    }

    @Transactional(readOnly = true)
    public List<GroupApplicationResponseDto> getApplications(Long recruitmentId, String requesterId) {
        GroupRecruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new EntityNotFoundException("모집글이 존재하지 않습니다."));

        if (!recruitment.getUser().getUserId().equals(requesterId)) {
            throw new AccessDeniedException("신청자 목록은 모집글 작성자만 조회할 수 있습니다.");
        }

        return applicationRepository.findAllByRecruitment_Id(recruitmentId).stream()
                .map(GroupApplicationResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateApplicationStatus(Long recruitmentId, String targetUserId, ApplicationStatus newStatus, String requesterId) {
        GroupRecruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new EntityNotFoundException("모집글이 존재하지 않습니다."));

        if (!recruitment.getUser().getUserId().equals(requesterId)) {
            throw new AccessDeniedException("신청 승인/거절은 작성자만 수행할 수 있습니다.");
        }

        GroupApplication application = applicationRepository.findByRecruitment_IdAndUser_UserId(recruitmentId, targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("신청 내역이 없습니다."));

        if (newStatus == ApplicationStatus.ACCEPTED) application.approve();
        else if (newStatus == ApplicationStatus.REJECTED) application.reject();
    }
}
