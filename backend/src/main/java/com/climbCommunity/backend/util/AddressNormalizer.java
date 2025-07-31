package com.climbCommunity.backend.util;

import org.springframework.stereotype.Component;

@Component
public class AddressNormalizer {

    public String normalize(String rawAddress) {
        if (rawAddress == null || rawAddress.trim().isEmpty()) return "";

        return rawAddress
                .replaceAll("([가-힣]+)(\\d+)(길)", "$1 $2$3") // 백제고분로45길 → 백제고분로 45길
                .replaceAll("([가-힣]+)(\\d+)(로)", "$1 $2$3") // 백제고분로45 → 백제고분로 45
                .replaceAll("(길)(\\d+)", "$1 $2")           // 길25 → 길 25
                .replaceAll("(로)(\\d+)", "$1 $2")           // 로25 → 로 25
                .replaceAll("\\s+", " ")
                .trim();
    }
}
