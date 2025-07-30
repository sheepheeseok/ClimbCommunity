package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.user.UserResponseDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserAddress;
import com.climbCommunity.backend.entity.enums.Role;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.UserAddressRepository;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.util.AddressUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;

    public Page<UserResponseDto> getAllUsers(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage;

        if (keyword != null && !keyword.isEmpty()) {
            userPage = userRepository.findByUsernameContainingOrUserIdContaining(keyword, keyword, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        return userPage.map(this::toResponseDto);
    }

        public void updateUserStatus (String userId, String status){
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
            user.setStatus(Status.valueOf(status)); // 소문자 Enum이면 .valueOf(status.toLowerCase())
            userRepository.save(user);
        }

        public void updateUserRole (String userId, String role){
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
            user.setRole(Role.valueOf(role)); // 마찬가지로 Enum 처리
            userRepository.save(user);
        }

        public void deleteUser (String userId){
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
            userRepository.delete(user);
        }

    private UserResponseDto toResponseDto(User user) {
        // ✅ 대표 주소 조회
        UserAddress primaryAddress = userAddressRepository.findByUserIdAndIsPrimaryTrue(user.getId())
                .orElse(null);

        String address1 = primaryAddress != null
                ? AddressUtil.extractRoadName(primaryAddress.getAddress())
                : null;

        String address2 = primaryAddress != null
                ? AddressUtil.extractDetailAddress(primaryAddress.getAddress())
                : null;

        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .tel(user.getTel())
                .address1(address1)
                .address2(address2)
                .role(user.getRole().name())
                .Grade(user.getGrade().name())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}