import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://15.168.142.176:8080",
    withCredentials: true
});

// 요청마다 localStorage에서 토큰 읽어 Bearer 헤더 붙이기
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
