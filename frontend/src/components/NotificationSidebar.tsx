import React from "react";
import { NotificationItem } from "@/components/NotificationItem";

interface Notification {
    id: string;
    username: string;
    action: string;
    time: string;
    avatar: string;
    isRead?: boolean;
}

interface NotificationSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isOpen, onClose }) => {
    const thisWeekNotifications: Notification[] = [
        {
            id: "1",
            username: "클라이밍매니아",
            action: "님이 회원님의 스토리를 좋아합니다.",
            time: "1시간 전",
            avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
            isRead: false,
        },
        {
            id: "2",
            username: "산악인김씨",
            action: "님이 회원님을 팔로우하기 시작했습니다.",
            time: "3시간 전",
            avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
            isRead: true,
        },
    ];

    return (
        <div className="p-6 h-full flex flex-col">
            {/* Header (검색 사이드바와 동일 레이아웃) */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">알림</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <CloseIcon className="text-gray-500 hover:text-gray-700" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-1 py-2 border-b border-gray-200 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">이번 주</h3>
                </div>

                {thisWeekNotifications.length > 0 ? (
                    <div className="space-y-2">
                        {thisWeekNotifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
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