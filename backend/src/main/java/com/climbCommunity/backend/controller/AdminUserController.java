package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.user.UserResponseDto;
import com.climbCommunity.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminUserService.getAllUsers(page, size, keyword));
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {
        adminUserService.updateUserStatus(userId, request.get("status"));
        return ResponseEntity.ok(Map.of("message", "회원 상태가 변경되었습니다."));
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {
        adminUserService.updateUserRole(userId, request.get("role"));
        return ResponseEntity.ok(Map.of("message", "회원 Role이 변경되었습니다."));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        adminUserService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "회원이 삭제되었습니다."));
    }
}
