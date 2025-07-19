package com.climbCommunity.backend.init;

import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Role;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitUser {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (userRepository.existsByUsername("climber123")) {
            System.out.println("✅ 초기 계정 이미 존재: climber123");
            return;
        }

        String rawPassword = "123456";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = User.builder()
                .username("climber123")
                .userId("climber123")
                .email("test@example.com")
                .password(encodedPassword)
                .address1("서울특별시 강남구")
                .address2("역삼동 123-45")
                .tel("010-1234-1234")
                .grade(Grade.White)
                .status(Status.active)
                .role(Role.ADMIN)
                .profileImage(null)
                .build();

        userRepository.save(user);
        System.out.println("✅ 초기 계정 생성 완료: climber123");
    }
}