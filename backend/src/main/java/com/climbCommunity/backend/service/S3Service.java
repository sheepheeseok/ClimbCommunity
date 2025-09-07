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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadFile(MultipartFile file, Long userId, String postDir) {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String safeDir = postDir.endsWith("/") ? postDir : postDir + "/";
        String uniqueFileName = UUID.randomUUID() + (extension != null && !extension.isBlank() ? "." + extension : "");

        // 최종 key = users/{userId}/posts/{postId}/images/{uuid}.png
        String key = "users/" + userId + "/" + safeDir + uniqueFileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest request = new PutObjectRequest(bucket, key, inputStream, metadata);
            amazonS3.putObject(request);

            log.info("S3 파일 업로드 성공: {}", key);
            return key; // key를 DB에 저장 (URL 대신)
        } catch (IOException e) {
            log.error("S3 파일 업로드 실패", e);
            throw new RuntimeException("파일 업로드 실패", e);
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

    public void deletePostFolder(Long postId) {
        String prefix = "posts/" + postId + "/";

        ObjectListing listing = amazonS3.listObjects(bucket, prefix);
        List<DeleteObjectsRequest.KeyVersion> keys = new ArrayList<>();

        for (S3ObjectSummary summary : listing.getObjectSummaries()) {
            keys.add(new DeleteObjectsRequest.KeyVersion(summary.getKey()));
        }

        if (!keys.isEmpty()) {
            DeleteObjectsRequest deleteRequest = new DeleteObjectsRequest(bucket).withKeys(keys);
            amazonS3.deleteObjects(deleteRequest);
            log.info("S3 폴더 삭제 완료: {}", prefix);
        } else {
            log.info("삭제할 S3 파일이 없습니다: {}", prefix);
        }
    }

    public String getFileUrl(String key) {
        return amazonS3.getUrl(bucket, key).toString();
    }

}
