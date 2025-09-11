import React from "react";

interface Notification {
    id: string;
    username: string;
    action: string;
    time: string;
    avatar: string;
    isRead?: boolean;
}

export const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => (
    <div
        className={`flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
            !notification.isRead ? "bg-blue-50" : ""
        }`}
    >
        <img
            src={notification.avatar}
            alt={notification.username}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 leading-relaxed">
                <span className="font-semibold">{notification.username}</span>
                <span className="ml-1">{notification.action}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>
    </div>
);
