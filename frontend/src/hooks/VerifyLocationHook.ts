import { useState, useEffect } from "react";

interface VerifiedLocation {
    dong: string;
    address: string;
    verifiedAt: string;
}

export const VerifyLocationHook = () => {
    const [fallbackDong, setFallbackDong] = useState<string | null>(null); // address2로부터 추출
    const [verifiedDong, setVerifiedDong] = useState<string | null>(null); // 인증된 dong
    const [locations, setLocations] = useState<VerifiedLocation[]>([]);

    // ✅ 사용자 주소 불러오기 (address1 + address2 + 동 추출)
    const fetchUserAddress = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/users/myinfo", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                const fullAddress = `${data.address1 ?? ""} ${data.address2 ?? ""}`.trim();
                const dong = extractDongFromAddress(fullAddress);
                if (dong) setFallbackDong(dong);
            }
        } catch (e) {
            console.error("주소 정보 불러오기 실패", e);
        }
    };

    // 사용자의 인증 된 위치 모두 가져오기
    const fetchVerifiedLocations = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/users/me/locations", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.ok) {
                const data: VerifiedLocation[] = await res.json();
                setLocations(data);
                if (data.length > 0) {
                    setVerifiedDong(data[0].dong); // 최신 인증된 동
                }
            }
        } catch (e) {
            console.error("인증된 위치 목록 조회 실패", e);
        }
    };

    // 초기 데이터 불러오기
    useEffect(() => {
        fetchUserAddress();
        fetchVerifiedLocations();
    }, []);


    // UI 표시할 동 이름 계산
    const getDisplayedDong = () => {
        if (verifiedDong) return verifiedDong;
        if (fallbackDong) return `${fallbackDong} (인증 필요)`;
        return "위치 미설정";
    };

    // 위치 인증 실행
    const handleVerifyLocation = async () => {
        if (!fallbackDong) {
            alert("주소 정보가 없습니다. 인증할 수 없습니다.");
            return;
        }

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );

            const { latitude, longitude } = position.coords;

            // ✅ 1. 인증 요청
            const res = await fetch("http://localhost:8080/api/users/me/verify-location", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    selectedAddress: `${fallbackDong}`,
                    latitude,
                    longitude,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setVerifiedDong(data.dong); // 즉시 반영
                fetchVerifiedLocations();   // 목록 갱신
                alert("위치 인증 성공");
            } else {
                const data = await res.json();
                alert("실패: " + (data.message || "위치 인증 실패"));
            }
        } catch (e) {
            alert("위치 정보를 가져올 수 없습니다.");
        }
    };

    return {
        getDisplayedDong,
        locations,
        handleVerifyLocation,
    };
};

function extractDongFromAddress(address: string): string | null {
    const regex = /([가-힣]+동)/;
    const match = address.match(regex);
    return match ? match[1] : null;
}
