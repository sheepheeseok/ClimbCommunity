package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.location.Coordinate;
import com.climbCommunity.backend.dto.user.*;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserAddress;
import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Role;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.FollowRepository;
import com.climbCommunity.backend.repository.PostRepository;
import com.climbCommunity.backend.repository.UserAddressRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NaverMapService naverMapService;
    private final NaverReverseGeocodingService naverReverseGeocodingService;
    private final UserAddressRepository userAddressRepository;
    private final S3Service s3Service;
    private final FollowRepository followRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User registerUser(UserRegisterRequestDto dto) {
        if (userRepository.findByUserId(dto.getUserId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        User user = User.builder()
                .userId(dto.getUserId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .tel(dto.getTel())
                .birthdate(dto.getBirthdate())
                .grade(Grade.White)
                .profileImage(null)
                .role(Role.USER)
                .status(Status.active)
                .build();

        userRepository.save(user);

        // 2. 주소 처리
        String fullAddress = dto.getAddress1() + " " + dto.getAddress2();

        Coordinate coordinate = naverMapService.geocodeAddress(fullAddress)
                .orElseThrow(() -> new IllegalArgumentException("주소로 좌표를 찾을 수 없습니다."));

        String dong = naverReverseGeocodingService.reverseGeocodeOnly(
                coordinate.getLatitude(),
                coordinate.getLongitude()
        ).orElse("미확인");

        UserAddress userAddress = UserAddress.builder()
                .user(user)
                .address(fullAddress)
                .dong(dong)
                .latitude(coordinate.getLatitude())
                .longitude(coordinate.getLongitude())
                .isPrimary(true)
                .isVerified(false)
                .build();

        userAddressRepository.save(userAddress);

        return user;
    }

    @Transactional
    public User updateUserProfile(String userId, UserUpdateRequestDto dto, MultipartFile profileImage) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getWebsite() != null) user.setWebsite(dto.getWebsite());

        // ✅ 프로필 이미지 업로드 처리
        if (profileImage != null && !profileImage.isEmpty()) {
            String newUrl = s3Service.uploadProfileImage(profileImage, user.getId(), user.getProfileImage());
            user.setProfileImage(newUrl);
        }

        return userRepository.save(user);
    }


    @Transactional
    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<UserSearchResponseDto> searchUsersByUserIdPrefix(String prefix) {
        List<User> users = userRepository.findByUserIdStartingWith(prefix);
        return users.stream()
                .map(user -> new UserSearchResponseDto(
                        user.getId(),
                        user.getUserId(),
                        user.getUsername(),
                        user.getProfileImage()
                ))
                .collect(Collectors.toList());
    }

    public boolean getPrivacy(Long userId) {
        return userRepository.findById(userId)
                .map(User::isPrivate)
                .orElse(false);
    }

    // ✅ 계정 공개 여부 수정
    @Transactional
    public void updatePrivacy(Long userId, boolean isPrivate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPrivate(isPrivate);
    }

    @Transactional(readOnly = true)
    public List<UserSuggestionDto> getSuggestedFriends(Long userId) {
        // 1️⃣ 내 팔로잉/팔로워 목록 조회
        List<Long> excludedIds = followRepository.findAllFollowedOrFollowingIds(userId);
        excludedIds.add(userId); // 자기 자신 제외

        // 2️⃣ 팔로우 안 되어있는 유저 중 랜덤 4명
        List<User> candidates = userRepository.findByIdNotIn(excludedIds);

        // 3️⃣ 랜덤 4명 추출
        Collections.shuffle(candidates);
        List<User> picked = candidates.stream().limit(4).toList();

        // 4️⃣ DTO 변환
        return picked.stream()
                .map(u -> new UserSuggestionDto(u.getUserId(), u.getUsername(), u.getProfileImage()))
                .toList();
    }
}
