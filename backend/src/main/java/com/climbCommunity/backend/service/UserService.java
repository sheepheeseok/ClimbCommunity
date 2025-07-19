package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.user.UserRegisterRequestDto;
import com.climbCommunity.backend.dto.user.UserUpdateRequestDto;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Role;
import com.climbCommunity.backend.entity.enums.Status;
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
                .address1(dto.getAddress1())
                .address2(dto.getAddress2())
                .grade(Grade.White)
                .profileImage(null)
                .role(Role.USER)
                .status(Status.active)
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserProfile(String userId, UserUpdateRequestDto dto) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if (dto.getTel() != null) user.setTel(dto.getTel());
        if (dto.getAddress1() != null) user.setAddress1(dto.getAddress1());
        if (dto.getAddress2() != null) user.setAddress2(dto.getAddress2());
        if (dto.getProfileImage() != null) user.setProfileImage(dto.getProfileImage());

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
