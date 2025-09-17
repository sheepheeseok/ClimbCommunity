import React from "react";
import { NotificationItem } from "@/components/NotificationItem";
import { notificationService } from "@/services/notificationService";
import { timeAgo } from "@/utils/timeAgo";

export const NotificationSidebar: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    notifications: any[];
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ isOpen, onClose, notifications, setNotifications }) => {

    return (
        <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">알림</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                    <div className="space-y-2">
                        {notifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={{
                                    id: String(n.id),
                                    username: n.type === "FOLLOW" ? "새 팔로워" : "시스템",
                                    action: n.message,
                                    time: timeAgo(n.createdAt),
                                    avatar: "/default-avatar.png", // TODO: 프로필 이미지 연동
                                    isRead: n.isRead,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">새로운 알림이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
