import React from "react";
import { useNavigate } from "react-router-dom";

interface Notification {
    id: string;
    username: string;     // 닉네임
    actorUserId?: string; // ✅ 백엔드에서 내려주는 실제 userId 필드 추가
    actorProfileImage?: string;
    action: string;
    preview?: string;
    time: string;
    profileImage: string;
    isRead?: boolean;
    type?: string;
    targetId?: number;
    postId?: number;
}

export const NotificationItem: React.FC<{
    notification: Notification;
    onClick: (n: Notification) => void;
}> = ({ notification, onClick }) => {
    const navigate = useNavigate();

    const goToProfile = (e: React.MouseEvent) => {
        e.stopPropagation(); // 알림 전체 클릭 이벤트 막음
        if (notification.actorUserId) {
            navigate(`/${notification.actorUserId}/profile`);
        }
    };

    return (
        <div
            className={`flex items-start space-x-3 p-1 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.isRead ? "bg-blue-50" : ""
            }`}
            onClick={() => {
                console.log("✅ NotificationItem 전체 클릭:", notification);
                onClick(notification);
            }}
        >
            <img
                src={notification.profileImage}
                alt={notification.username}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                onClick={goToProfile}
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">
                    {(notification.actorUserId) && (
                        <span
                            className="font-semibold cursor-pointer hover:underline"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/${notification.actorUserId}/profile`);
                            }}
                        >
    {notification.actorUserId}
  </span>
                    )}
                    <span className="ml-1">{notification.action}</span>
                </p>
                {/* 댓글인 경우에만 프리뷰 추가 */}
                {notification.type === "COMMENT" && notification.preview && (
                    <p className="text-sm text-gray-600 truncate">
                        "{notification.preview}"
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
        </div>
    );
};
