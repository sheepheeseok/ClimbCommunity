package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.user.*;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

        UserResponseDto response = UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .tel(user.getTel())
                .address1(user.getAddress1())
                .address2(user.getAddress2())
                .Grade(user.getGrade().name())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/updateProfile")
    public ResponseEntity<UserResponseDto> updateProfile(@RequestBody UserUpdateRequestDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User updatedUser = userService.updateUserProfile(currentUserId, dto);

        UserResponseDto response = UserResponseDto.builder()
                .userId(updatedUser.getUserId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .tel(updatedUser.getTel())
                .address1(updatedUser.getAddress1())
                .address2(updatedUser.getAddress2())
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
                savedUser.getProfileImage()
        );

        return ResponseEntity.ok(response);
    }
}
