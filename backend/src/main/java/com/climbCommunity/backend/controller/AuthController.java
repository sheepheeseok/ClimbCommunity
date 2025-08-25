package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.login.LoginReqeustDto;
import com.climbCommunity.backend.dto.login.LoginResponseDto;
import com.climbCommunity.backend.dto.login.UserInfoDto;
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
    public ResponseEntity<UserInfoDto> login(
            @RequestBody LoginReqeustDto request,
            HttpServletResponse response
    ) {
        LoginResponseDto loginResponse = authService.login(request); // accessToken 생성

        // accessToken을 HttpOnly 쿠키에 저장
        ResponseCookie cookie = ResponseCookie.from("accessToken", loginResponse.getAccessToken())
                .httpOnly(true)
                .secure(true) // HTTPS 환경에서 true (로컬 테스트면 false 가능)
                .path("/")
                .sameSite("None") // 크로스도메인 허용 (secure=true 필수)
                .maxAge(60 * 60 * 24) // 1일
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 응답 바디에는 사용자 정보만 내려주면 됨
        return ResponseEntity.ok(new UserInfoDto(
                loginResponse.getUserId(),
                loginResponse.getUsername()
        ));
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