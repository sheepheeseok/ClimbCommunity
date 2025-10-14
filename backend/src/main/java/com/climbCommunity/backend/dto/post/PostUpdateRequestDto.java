package com.climbCommunity.backend.dto.post;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class PostUpdateRequestDto {
    private String content;
    private String location;
    private Map<String, Integer> completedProblems;
}
