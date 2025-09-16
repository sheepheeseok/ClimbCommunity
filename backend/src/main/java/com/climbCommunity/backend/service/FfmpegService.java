package com.climbCommunity.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class FfmpegService {

    private final Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));

    // ✅ 정규식 패턴
    private static final Pattern DURATION_PATTERN = Pattern.compile("Duration: (\\d{2}:\\d{2}:\\d{2}\\.\\d{2})");
    private static final Pattern TIME_PATTERN = Pattern.compile("time=(\\d{2}:\\d{2}:\\d{2}\\.\\d{2})");

    public String normalizeVideo(String inputPath, Consumer<Integer> progressCallback) {
        try {
            File inputFile = new File(inputPath);
            if (!inputFile.exists()) {
                throw new IllegalArgumentException("입력 파일이 존재하지 않습니다: " + inputPath);
            }

            File outputFile = tempDir.resolve("processed_" + UUID.randomUUID() + ".mp4").toFile();

            ProcessBuilder pb = new ProcessBuilder(
                    "ffmpeg",
                    "-i", inputFile.getAbsolutePath(),
                    "-c:v", "libx264",
                    "-preset", "veryfast",
                    "-crf", "25",
                    "-c:a", "aac",
                    "-movflags", "+faststart",
                    "-metadata:s:v:0", "rotate=0",
                    "-map_metadata", "-1",
                    outputFile.getAbsolutePath()
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            double duration = 0.0;

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    // 🎯 전체 길이 파싱
                    Matcher durationMatcher = DURATION_PATTERN.matcher(line);
                    if (durationMatcher.find()) {
                        duration = parseTimeToSeconds(durationMatcher.group(1));
                        log.debug("🎞 영상 총 길이: {}초", duration);
                    }

                    // 🎯 현재 진행 시간 파싱
                    Matcher timeMatcher = TIME_PATTERN.matcher(line);
                    if (timeMatcher.find() && duration > 0) {
                        double current = parseTimeToSeconds(timeMatcher.group(1));
                        int percent = (int) Math.min(100, (current / duration) * 100);
                        progressCallback.accept(percent);
                    }
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg 변환 실패 (exitCode=" + exitCode + ")");
            }

            // ✅ 마지막에 100% 강제 보장
            progressCallback.accept(100);

            return outputFile.getAbsolutePath();

        } catch (Exception e) {
            throw new RuntimeException("영상 처리 중 오류 발생", e);
        }
    }

    /** "HH:mm:ss.xx" → 초 단위 변환 */
    private double parseTimeToSeconds(String timeStr) {
        try {
            String[] parts = timeStr.split(":");
            double h = Double.parseDouble(parts[0]);
            double m = Double.parseDouble(parts[1]);
            double s = Double.parseDouble(parts[2]);
            return h * 3600 + m * 60 + s;
        } catch (Exception e) {
            return 0;
        }
    }
}
