// src/services/feedService.ts
import api from "@/lib/axios";

export const feedService = {
    async getFeed() {
        const res = await api.get("/api/feed", { withCredentials: true });
        return res.data;
    },
};
