package com.climbCommunity.backend.controller;

import com.climbCommunity.backend.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatFileController {

    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadChatFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("accountId") Long accountId,
            @RequestParam("partnerId") Long partnerId,
            @RequestParam("roomId") Long roomId
    ) {
        String fileUrl = s3Service.uploadChatFile(file, roomId);
        return ResponseEntity.ok(fileUrl);
    }
}
