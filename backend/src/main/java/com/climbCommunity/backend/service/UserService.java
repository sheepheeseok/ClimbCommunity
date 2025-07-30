package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.location.Coordinate;
import com.climbCommunity.backend.dto.user.UserRegisterRequestDto;
import com.climbCommunity.backend.dto.user.UserUpdateRequestDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserAddress;
import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Role;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.UserAddressRepository;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NaverMapService naverMapService;
    private final NaverReverseGeocodingService naverReverseGeocodingService;
    private final UserAddressRepository userAddressRepository;

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
    public User updateUserProfile(String userId, UserUpdateRequestDto dto) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if (dto.getTel() != null) user.setTel(dto.getTel());
        if (dto.getProfileImage() != null) user.setProfileImage(dto.getProfileImage());

        // ✅ 주소가 전달된 경우 처리
        if (dto.getAddress1() != null && dto.getAddress2() != null) {
            String fullAddress = dto.getAddress1() + " " + dto.getAddress2();

            // 1. 기존 대표 주소 → isPrimary = false 처리
            userAddressRepository.findByUserIdAndIsPrimaryTrue(user.getId())
                    .ifPresent(primary -> {
                        primary.setPrimary(false);
                        userAddressRepository.save(primary);
                    });

            // 2. 새 주소 → 좌표 및 동 추출
            Coordinate coordinate = naverMapService.geocodeAddress(fullAddress)
                    .orElseThrow(() -> new IllegalArgumentException("주소를 좌표로 변환할 수 없습니다."));

            String dong = naverReverseGeocodingService.reverseGeocodeOnly(coordinate.getLatitude(), coordinate.getLongitude())
                    .orElse("미확인");

            // 3. 새로운 주소 추가
            UserAddress newAddress = UserAddress.builder()
                    .user(user)
                    .address(fullAddress)
                    .dong(dong)
                    .latitude(coordinate.getLatitude())
                    .longitude(coordinate.getLongitude())
                    .isPrimary(true)      // 새 주소가 대표 주소가 됨
                    .isVerified(false)    // 아직 인증된 주소는 아님
                    .build();

            userAddressRepository.save(newAddress);
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
}
