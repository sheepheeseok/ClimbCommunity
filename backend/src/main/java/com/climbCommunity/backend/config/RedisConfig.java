package com.climbCommunity.backend.config;

import com.climbCommunity.backend.dto.location.Coordinate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Coordinate> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Coordinate> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Coordinate.class));
        return template;
    }
}