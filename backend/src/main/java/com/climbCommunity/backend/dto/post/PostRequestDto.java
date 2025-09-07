package com.climbCommunity.backend.dto.post;


import com.climbCommunity.backend.entity.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
public class PostRequestDto {
    private Long userId;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @NotNull
    private Category category;

    private String location;
    private LocalDate date;

    private Map<String, Integer> triedProblems;
    private Map<String, Integer> completedProblems;

    private Integer thumbnailIndex;
}
