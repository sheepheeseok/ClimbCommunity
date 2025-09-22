package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.login.LoginReqeustDto;
import com.climbCommunity.backend.dto.login.LoginResponseDto;
import com.climbCommunity.backend.dto.user.*;
import com.climbCommunity.backend.service.AuthService;
import com.climbCommunity.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginReqeustDto request,
            HttpServletResponse response
    ) {
        LoginResponseDto loginResponse = authService.login(request); // accessToken 생성

        // accessToken을 HttpOnly 쿠키에도 저장
        ResponseCookie cookie = ResponseCookie.from("accessToken", loginResponse.getAccessToken())
                .httpOnly(true)
                .secure(false)   // 개발환경: false
                .sameSite("Lax") // 개발환경: 반드시 Lax
                .path("/")
                .maxAge(60 * 60 * 24)
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // ✅ 응답 바디에 토큰 + 사용자 정보 같이 내려주기
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(0) // 즉시 만료
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/findUserId")
    public ResponseEntity<FindUserIdResponseDto> findUserId(@RequestBody FindUserIdRequest request) {
        FindUserIdResponseDto response = authService.findUserId(request);
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

    @GetMapping("/check-duplicate")
    public ResponseEntity<Map<String, Boolean>> checkDuplicate(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String username) {

        boolean isUserIdDuplicate = false;
        boolean isUsernameDuplicate = false;

        if (userId != null && !userId.isBlank()) {
            isUserIdDuplicate = authService.isUserIdTaken(userId);
        }

        if (username != null && !username.isBlank()) {
            isUsernameDuplicate = authService.isUsernameTaken(username);
        }

        return ResponseEntity.ok(Map.of(
                "userId", isUserIdDuplicate,
                "username", isUsernameDuplicate
        ));
    }
}