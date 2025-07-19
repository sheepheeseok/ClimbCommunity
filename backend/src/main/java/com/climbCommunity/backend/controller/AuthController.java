package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.login.LoginReqeustDto;
import com.climbCommunity.backend.dto.login.LoginResponseDto;
import com.climbCommunity.backend.dto.user.*;
import com.climbCommunity.backend.service.AuthService;
import com.climbCommunity.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginReqeustDto request) {
        LoginResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/findUserId")
    public ResponseEntity<FindUserIdResponse> findUserId(@RequestBody FindUserIdRequest request) {
        FindUserIdResponse response = authService.findUserId(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/findPassword")
    public ResponseEntity<FindPasswordResponse> findPassword(@RequestBody FindPasswordRequest request) {
        FindPasswordResponse response = authService.findPassword(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<Map<String, String>> deleteAccount(Authentication authentication) {
        String userId = authentication.getName();
        authService.deleteAccount(userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "회원탈퇴가 완료되었습니다.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/restoreAccount")
    public ResponseEntity<Map<String, String>> restoreAccount(Authentication authentication) {
        String userId = authentication.getName();
        authService.restoreAccount(userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "계정이 복구되었습니다.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequestDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        userService.changePassword(currentUserId, dto.getCurrentPassword(), dto.getNewPassword());

        return ResponseEntity.ok().body(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
    }
}