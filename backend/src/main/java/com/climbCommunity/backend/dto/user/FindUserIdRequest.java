package com.climbCommunity.backend.dto.user;

import lombok.Data;

@Data
public class FindUserIdRequest {
    private String email;
    private String tel;
}
