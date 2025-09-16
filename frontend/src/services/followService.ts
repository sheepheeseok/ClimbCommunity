import api from "@/lib/axios";

const API_BASE = "/api/users";

export const followService = {
    // ✅ 팔로우 여부 확인
    isFollowing: async (targetUserId: string): Promise<boolean> => {
        const res = await api.get(`/api/users/${targetUserId}/is-following`, {
            withCredentials: true,
        });
        return res.data.isFollowing;
    },

    // ✅ 팔로우 요청
    follow: async (targetUserId: string) => {
        return api.post(`/api/users/${targetUserId}/follow`, {}, { withCredentials: true });
    },

    // ✅ 언팔로우 요청
    unfollow: async (targetUserId: string) => {
        return api.delete(`/api/users/${targetUserId}/follow`, { withCredentials: true });
    },
};
