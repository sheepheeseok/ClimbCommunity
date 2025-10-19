package com.climbCommunity.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.climbCommunity.backend.entity.Post;
import com.climbCommunity.backend.entity.PostVideo;

import java.io.File;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncVideoService {

    private final FfmpegService ffmpegService;
    private final ProgressService progressService;
    private final S3Service s3Service;
    private final PostVideoService postVideoService;

    @Async("videoExecutor")
    public void processVideoAsync(Long postId, File tempFile, Long userId,
                                  String mediaDir, int order, Post savedPost) {
        try {
            String processedPath = ffmpegService.normalizeVideo(
                    tempFile.getAbsolutePath(),
                    percent -> {
                        progressService.setProgress(postId, percent);
                        log.debug("📈 진행률 업데이트: postId={}, {}%", postId, percent);
                    }
            );

            // ✅ 변환된 영상 S3 업로드
            String key = s3Service.uploadProcessedFile(processedPath, userId, mediaDir);

            PostVideo postVideo = PostVideo.builder()
                    .post(savedPost)
                    .videoUrl(key)
                    .type("video")
                    .orderIndex(order)
                    .build();
            postVideoService.save(postVideo);

            // ✅ 완료 시 100% 고정
            progressService.setProgress(postId, 100);

        } catch (Exception e) {
            log.error("❌ 비디오 처리 실패 (postId={}): {}", postId, e.getMessage(), e);
        } finally {
            tempFile.delete();
        }
    }
}

