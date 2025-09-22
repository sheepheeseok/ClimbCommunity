package com.climbCommunity.backend.service;

import com.climbCommunity.backend.dto.post.PostResponseDto;
import com.climbCommunity.backend.entity.Post;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PostEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishPostCreated(Post post) {
        PostResponseDto dto = PostResponseDto.fromEntity(post, 0L, 0L);

        messagingTemplate.convertAndSend("/topic/profile/" + post.getUser().getId(), dto);
    }
}
