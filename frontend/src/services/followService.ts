import api from "@/lib/axios";

const API_BASE = "/api/users";

export const followService = {
    // ✅ 팔로우 여부 확인
    getFollowStatus: async (targetUserId: string): Promise<"NONE" | "PENDING" | "ACCEPTED"> => {
        const res = await api.get(`/api/users/${targetUserId}/follow-status`, {
            withCredentials: true,
        });
        return res.data.status;
    },

    // ✅ 팔로우 요청
    follow: async (targetUserId: string): Promise<"ACCEPTED" | "PENDING"> => {
        const res = await api.post(`/api/users/${targetUserId}/follow`, {}, { withCredentials: true });
        return res.data.status;  // 반드시 {status:"ACCEPTED"} 내려옴
    },

    // ✅ 언팔로우 요청
    unfollow: async (targetUserId: string) => {
        return api.delete(`/api/users/${targetUserId}/follow`, { withCredentials: true });
    },

    // ✅ 내가 받은 팔로우 요청 목록 (비공개 계정일 때만 의미 있음)
    getPendingRequests: async () => {
        const res = await api.get(`${API_BASE}/follow-requests`, { withCredentials: true });
        return res.data; // [UserResponseDto...]
    },

// ✅ 팔로우 요청 승인
    acceptFollow: async (followId: number) => {
        return api.patch(`${API_BASE}/follow-requests/${followId}/accept`, {}, { withCredentials: true });
    },

// ✅ 팔로우 요청 거절
    rejectFollow: async (followId: number) => {
        return api.patch(`${API_BASE}/follow-requests/${followId}/reject`, {}, { withCredentials: true });
    },

    cancelRequest: (targetUserId: string) =>
        api.delete(`${API_BASE}/follow-requests/${targetUserId}/cancel`),
};
