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
        LoginResponseDto loginResponse = authService.login(request); // 토큰 포함 DTO

        // 토큰을 쿠키에 저장
        ResponseCookie cookie = ResponseCookie.from("accessToken", loginResponse.getAccessToken())
                .httpOnly(true)
                .secure(false) // 배포 시 true + HTTPS 필요
                .path("/")
                .maxAge(86400) // 1일
                .sameSite("Lax") // "None" 사용 시 secure=true 필수
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(loginResponse); // or return new ResponseEntity<>(loginResponse, HttpStatus.OK);
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