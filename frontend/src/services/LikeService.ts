// src/services/postLikeService.ts
import api from "@/lib/axios";

export const LikeService = {
    async toggleLike(postId: number) {
        const res = await api.post(`/api/posts/${postId}/like`);
        return res.data; // "좋아요 추가" 또는 "좋아요 취소"
    },

    async getLikeCount(postId: number) {
        const res = await api.get(`/api/posts/${postId}/like/count`);
        return res.data as number;
    },

    async hasUserLiked(postId: number) {
        const res = await api.get(`/api/posts/${postId}/like/check`);
        return res.data as boolean;
    },
};
