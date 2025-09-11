package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.user.*;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserAddress;
import com.climbCommunity.backend.repository.UserAddressRepository;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.ProfileService;
import com.climbCommunity.backend.service.UserService;
import com.climbCommunity.backend.util.AddressUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers().stream()
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .profileImage(user.getProfileImage())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/myinfo")
    public ResponseEntity<UserResponseDto> getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // ✅ 대표 주소 조회
        UserAddress primaryAddress = userAddressRepository.findByUserIdAndIsPrimaryTrue(user.getId())
                .orElse(null);

        String address1 = primaryAddress != null
                ? AddressUtil.extractRoadName(primaryAddress.getAddress())
                : null;

        String address2 = primaryAddress != null
                ? AddressUtil.extractDetailAddress(primaryAddress.getAddress())
                : null;

        UserResponseDto response = UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .tel(user.getTel())
                .address1(address1)
                .address2(address2)
                .Grade(user.getGrade().name())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }

    // 본인 프로필 불러오기
    @GetMapping("/me/profile")
    public ProfileResponseDto getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return profileService.getProfile(principal.getUserId());
    }

    // 유저 프로필 불러오기
    @GetMapping("/{userId}/profile")
    public ProfileResponseDto getUserProfile(@PathVariable String userId) {
        return profileService.getProfile(userId);
    }

    @PatchMapping("/updateProfile")
    public ResponseEntity<UserResponseDto> updateProfile(@RequestBody UserUpdateRequestDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User updatedUser = userService.updateUserProfile(currentUserId, dto);

        // ✅ 대표 주소 조회
        UserAddress primaryAddress = userAddressRepository.findByUserIdAndIsPrimaryTrue(updatedUser.getId())
                .orElse(null);

        String address1 = primaryAddress != null
                ? AddressUtil.extractRoadName(primaryAddress.getAddress())
                : null;

        String address2 = primaryAddress != null
                ? AddressUtil.extractDetailAddress(primaryAddress.getAddress())
                : null;

        UserResponseDto response = UserResponseDto.builder()
                .userId(updatedUser.getUserId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .tel(updatedUser.getTel())
                .address1(address1)
                .address2(address2)
                .Grade(updatedUser.getGrade().name())
                .profileImage(updatedUser.getProfileImage())
                .createdAt(updatedUser.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }


    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponseDto> registerUser(@RequestBody UserRegisterRequestDto dto) {
        User savedUser = userService.registerUser(dto);

        UserRegisterResponseDto response = new UserRegisterResponseDto(
                savedUser.getId(),
                savedUser.getUserId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getGrade().name(),
                savedUser.getProfileImage(),
                savedUser.getBirthdate()
        );

        return ResponseEntity.ok(response);
    }
}
