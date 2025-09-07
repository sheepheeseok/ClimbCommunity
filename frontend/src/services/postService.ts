import api from "@/lib/axios";

export async function fetchPosts() {
    const res = await api.get("/api/posts"); // 백엔드에서 전체 게시물 조회 API
    return res.data.content; // PostResponseDto[] 배열
}
