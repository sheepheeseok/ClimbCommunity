package com.climbCommunity.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadFile(MultipartFile file, String dirName) {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String safeDir = dirName.endsWith("/") ? dirName : dirName + "/";
        String uniqueFileName = safeDir + UUID.randomUUID() + "." + extension;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest request = new PutObjectRequest(bucket, uniqueFileName, inputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(request);
            log.info("파일 업로드 성공: {}", uniqueFileName);
            return amazonS3.getUrl(bucket, uniqueFileName).toString();
        } catch (IOException e) {
            log.error("S3 파일 업로드 중 IOException 발생", e);
            throw new RuntimeException("파일 업로드에 실패했습니다.", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
            log.info("파일 삭제 성공: {}", key);
        } catch (Exception e) {
            log.error("파일 삭제 실패: {}", fileUrl, e);
            throw new RuntimeException("파일 삭제에 실패했습니다.");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일은 업로드할 수 없습니다.");
        }
    }

    private String getExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(f.lastIndexOf(".") + 1))
                .orElseThrow(() -> new IllegalArgumentException("확장자가 없는 파일은 업로드할 수 없습니다."));
    }

    private String extractKeyFromUrl(String fileUrl) {
        int index = fileUrl.indexOf(".com/");
        if (index == -1) throw new IllegalArgumentException("올바르지 않은 S3 URL입니다.");
        return fileUrl.substring(index + 5);
    }
}
