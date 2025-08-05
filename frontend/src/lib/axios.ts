import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // 백엔드 주소
    withCredentials: true, // 쿠키 전송 허용
});

export default api;
