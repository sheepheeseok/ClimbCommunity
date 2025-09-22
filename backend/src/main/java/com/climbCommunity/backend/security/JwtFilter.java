package com.climbCommunity.backend.security;

import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository; // 필요시 DB fallback 용

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ 인증 불필요한 경로는 필터 통과
        if (path.startsWith("/api/auth/login") ||
                path.startsWith("/api/users/register") ||
                path.startsWith("/api/auth/logout") ||
                path.startsWith("/api/auth/check-duplicate") ||
                path.startsWith("/api/auth/findUserId") ||
                path.startsWith("/api/auth/findPassword")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 1. 쿠키 → 2. Authorization 헤더 순으로 토큰 추출
        String token = extractTokenFromCookies(request);
        if (token == null) {
            token = extractTokenFromAuthorizationHeader(request);
        }

        if (token != null && jwtUtil.validateToken(token)) {
            try {
                // ✅ JWT에서 값 추출
                Long id = jwtUtil.extractId(token);                 // DB PK
                String userId = jwtUtil.extractUserId(token);       // 비즈니스 ID
                log.info(">>> JwtFilter parsed id={}, userId={}", id, userId);
                String username = jwtUtil.extractAllClaims(token).get("username", String.class);
                String role = jwtUtil.extractAllClaims(token).get("role", String.class);

                // ✅ UserPrincipal 직접 생성 (DB 조회 X)
                UserPrincipal userPrincipal = new UserPrincipal(
                        id,
                        userId,
                        username,
                        "",      // 비밀번호는 토큰에서 불필요
                        role
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userPrincipal,
                                null,
                                userPrincipal.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                log.warn("JWT 처리 오류: {}", e.getMessage());
            }
        } else {
            log.debug("👉 No valid JWT token found (cookie or Authorization header)");
        }

        filterChain.doFilter(request, response);
    }

    // ✅ Authorization 헤더에서 Bearer 토큰 추출
    private String extractTokenFromAuthorizationHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    // ✅ 쿠키에서 accessToken 추출
    private String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}

