import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { notificationService } from "@/services/notificationService";

export function useNotificationEvents(userId: string) {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;
        (async () => {
            try {
                const data = await notificationService.getNotifications();
                setNotifications(data);
            } catch (e) {
                console.error("알림 조회 실패:", e);
            }
        })();
    }, [userId]);

    useWebSocket([
        {
            destination: `/topic/notifications/${userId}`,
            handler: (msg) => {
                const body = JSON.parse(msg.body);
                setNotifications((prev) => [body, ...prev]);
            },
        },
    ]);

    return { notifications, setNotifications };
}
