package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.login.LoginReqeustDto;
import com.climbCommunity.backend.dto.login.LoginResponseDto;
import com.climbCommunity.backend.dto.user.FindPasswordRequest;
import com.climbCommunity.backend.dto.user.FindPasswordResponse;
import com.climbCommunity.backend.dto.user.FindUserIdRequest;
import com.climbCommunity.backend.dto.user.FindUserIdResponse;
import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserAddress;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.UserAddressRepository;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.security.JwtUtil;
import com.climbCommunity.backend.util.AddressUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtUtil jwtutil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;

    public LoginResponseDto login(LoginReqeustDto dto) {
        User user = userService.findByUserId(dto.getUserId())
                .orElseThrow(() -> new UsernameNotFoundException("아이디가 올바르지 않습니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("비밀번호가 올바르지 않습니다.");
        }

        String token = jwtutil.generateToken(user.getUserId());

        // ✅ 대표 주소 조회 및 분해
        UserAddress primaryAddress = userAddressRepository.findByUserIdAndIsPrimaryTrue(user.getId())
                .orElse(null);

        String address1 = primaryAddress != null
                ? AddressUtil.extractRoadName(primaryAddress.getAddress())
                : null;

        String address2 = primaryAddress != null
                ? AddressUtil.extractDetailAddress(primaryAddress.getAddress())
                : null;

        return new LoginResponseDto(
                token,
                user.getId(),
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getTel(),
                address1,
                address2,
                user.getGrade().name(),
                user.getProfileImage()
        );
    }

    public FindUserIdResponse findUserId(FindUserIdRequest request) {
        User user = null;

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("가입된 정보가 없습니다."));
        } else if (request.getTel() != null && !request.getTel().isEmpty()) {
            user = userRepository.findByTel(request.getTel())
                    .orElseThrow(() -> new UsernameNotFoundException("가입된 정보가 없습니다."));
        } else {
            throw new IllegalArgumentException("정보가 입력해주세요");
        }

        return new FindUserIdResponse(user.getUserId());
    }

    public FindPasswordResponse findPassword(FindPasswordRequest request) {

        User user = userRepository.findByUserIdAndEmail(request.getUserId(), request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("가입된 정보가 없습니다."));

        String tempPassword = generateTempPassword(8);

        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        logTempPassword(user.getEmail(), tempPassword);

        return new FindPasswordResponse("등록된 이메일로 임시 비밀번호를 발송했습니다.");
    }

    private String generateTempPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        SecureRandom random = new SecureRandom();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private void logTempPassword(String email, String tempPassword) {
        System.out.println("[DEBUG] 임시 비밀번호 발송 대상: " + email);
        System.out.println("[DEBUG] 임시 비밀번호: " + tempPassword);
        // 추후 SNS 연동 예정
    }

    public void deleteAccount(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        if (user.getStatus() == Status.deleted) {
            throw new IllegalStateException("이미 탈퇴 처리된 계정입니다.");
        }

        user.setStatus(Status.deleted);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void restoreAccount(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        if (!user.canRestore()) {
            throw new IllegalStateException("복구 기간(30일)이 지났거나 탈퇴 상태가 아닙니다.");
        }

        user.setStatus(Status.active);
        user.setDeletedAt(null);
        userRepository.save(user);
    }
}
