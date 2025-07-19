package com.climbCommunity.backend.dto.post;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequestDto {
    private Long userId;

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 150, message = "제목은 최대 150자입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;
}
