package com.climbCommunity.backend.init;

import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.UserAddress;
import com.climbCommunity.backend.entity.enums.Gender;
import com.climbCommunity.backend.entity.enums.Grade;
import com.climbCommunity.backend.entity.enums.Role;
import com.climbCommunity.backend.entity.enums.Status;
import com.climbCommunity.backend.repository.UserAddressRepository;
import com.climbCommunity.backend.repository.UserRepository;
import com.climbCommunity.backend.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Component
@RequiredArgsConstructor
public class InitUser {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAddressRepository userAddressRepository;

    @Transactional
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
                .tel("010-1234-1234")
                .grade(Grade.White)
                .status(Status.active)
                .role(Role.ADMIN)
                .gender(Gender.MALE)
                .profileImage(null)
                .build();

        User savedUser = userRepository.save(user);
        userRepository.flush();

        UserAddress address = UserAddress.builder()
                .user(savedUser)
                .address("서울특별시 강남구 논현동 123-4")
                .dong("논현동")
                .latitude(37.5112)
                .longitude(127.0207)
                .isVerified(true)
                .isPrimary(true)
                .createdAt(LocalDateTime.now())
                .build();

        userAddressRepository.save(address);

        System.out.println("✅ 초기 계정 생성 완료: climber123");
    }
}