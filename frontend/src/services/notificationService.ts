import api from "@/lib/axios";

export const notificationService = {
    // 안 읽은 알림 가져오기
    getNotifications: async () => {
        const res = await api.get("/api/notifications", { withCredentials: true });
        return res.data;
    },

    // 특정 알림 읽음 처리
    markAsRead: async (id: number) => {
        await api.patch(`/api/notifications/${id}/read`, {}, { withCredentials: true });
    },

    // 전체 알림 읽음 처리
    markAllAsRead: async () => {
        await api.patch("/api/notifications/read-all", {}, { withCredentials: true });
    },
};
