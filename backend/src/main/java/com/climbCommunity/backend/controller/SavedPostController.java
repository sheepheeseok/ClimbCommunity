package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.SavedPost;
import com.climbCommunity.backend.security.UserPrincipal;
import com.climbCommunity.backend.service.SavedPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class SavedPostController {

    private final SavedPostService savedPostService;

    /**
     * 저장 여부 확인
     */
    @GetMapping("/{postId}/save")
    public ResponseEntity<Boolean> isSaved(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long postId) {
        boolean saved = savedPostService.isSaved(userPrincipal.getId(), postId);
        return ResponseEntity.ok(saved);
    }

    /**
     * 저장/해제 토글
     */
    @PostMapping("/{postId}/save")
    public ResponseEntity<Boolean> toggleSave(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long postId) {
        boolean saved = savedPostService.toggleSave(userPrincipal.getId(), postId);
        return ResponseEntity.ok(saved);
    }

    /**
     * 내가 저장한 게시글 목록 조회
     */
    @GetMapping("/saved")
    public ResponseEntity<List<PostResponseDto>> getSavedPosts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SavedPost> savedPosts = savedPostService.getSavedPosts(userPrincipal.getId());

        List<PostResponseDto> result = savedPosts.stream()
                .map(sp -> PostResponseDto.fromEntity(sp.getPost()))
                .toList();

        return ResponseEntity.ok(result);
    }
}
