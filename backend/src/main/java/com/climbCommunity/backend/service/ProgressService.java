package com.climbCommunity.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class ProgressService {

    private final Map<Long, Integer> progressMap = new ConcurrentHashMap<>();

    public int getProgress(Long postId) {
        return progressMap.getOrDefault(postId, 0);
    }

    public void setProgress(Long postId, int percent) {
        log.debug("📊 Progress 저장: postId={}, {}%", postId, percent);
        progressMap.put(postId, percent);
    }

    // 프론트가 완료 확인 후 일정 시간 뒤에 지우도록 별도 API에서 호출하는 게 안전
    public void clearProgress(Long postId) {
        progressMap.remove(postId);
        log.debug("🧹 Progress 제거: postId={}", postId);
    }
}


