package com.climbCommunity.backend.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AddressUtil {

    /**
     * 도로명 주소에서 '도로명'만 추출
     * 예: "서울 송파구 백제고분로45길 25" → "서울 송파구 백제고분로45길"
     */
    public static String extractRoadName(String fullAddress) {
        if (fullAddress == null) return null;
        return fullAddress.replaceAll(" \\d+.*$", "");
    }

    /**
     * 도로명 주소에서 '상세 주소(번지)'만 추출
     * 예: "서울 송파구 백제고분로45길 25" → "25"
     */
    public static String extractDetailAddress(String fullAddress) {
        if (fullAddress == null) return null;
        Matcher m = Pattern.compile(" (\\d+.*)$").matcher(fullAddress);
        return m.find() ? m.group(1) : "";
    }
}
