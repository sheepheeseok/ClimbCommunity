import axios from "axios";

let accessToken: string | null = localStorage.getItem("accessToken"); // ✅ 새로고침 시 복원

// ✅ 로그인 후 토큰 저장용 함수
export const setAccessToken = (token: string) => {
    accessToken = token;
    localStorage.setItem("accessToken", token); // 새로고침 대비
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://13.208.181.227:8080",
    withCredentials: true, // 쿠키 방식도 병행 (배포 환경 대비)
});

// ✅ 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export default api;
