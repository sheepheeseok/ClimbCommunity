import React from "react";
import { useNavigate } from "react-router-dom";
import { followService } from "@/services/followService";

interface Notification {
    id: string;
    username: string;     // 닉네임
    actorUserId?: string; // ✅ 백엔드에서 내려주는 실제 userId
    actorProfileImage?: string;
    action: string;
    preview?: string;
    time: string;
    profileImage: string;
    isRead?: boolean;
    type?: string;
    targetId?: number; // ✅ followId (FOLLOW_REQUEST일 때)
    postId?: number;
}

export const NotificationItem: React.FC<{
    notification: Notification;
    onClick: (n: Notification) => void;
    onRemove?: (id: string) => void; // ✅ 알림 제거 콜백
    onUsernameClick?: () => void; // ✅ 닉네임 클릭 시 알림창 닫기용
}> = ({ notification, onClick, onRemove, onUsernameClick }) => {
    const navigate = useNavigate();

    // ✅ 프로필 이동 함수 (닉네임/프로필 이미지 클릭 시)
    const goToProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (notification.actorUserId) {
            navigate(`/${notification.actorUserId}/profile`);
            onUsernameClick?.(); // ✅ 프로필 클릭 시 알림창 닫기
        }
    };

    // ✅ 팔로우 승인
    const handleAccept = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!notification.targetId) return;
        try {
            await followService.acceptFollow(notification.targetId);
            console.log("✅ 팔로우 요청 승인 완료");
            onRemove?.(notification.id);
        } catch (err) {
            console.error("❌ 팔로우 승인 실패", err);
        }
    };

    // ✅ 팔로우 거절
    const handleReject = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!notification.targetId) return;
        try {
            await followService.rejectFollow(notification.targetId);
            console.log("✅ 팔로우 요청 거절 완료");
            onRemove?.(notification.id);
        } catch (err) {
            console.error("❌ 팔로우 거절 실패", err);
        }
    };

    return (
        <div
            className={`flex items-start space-x-3 p-2 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.isRead ? "bg-blue-50" : ""
            }`}
            onClick={() => onClick(notification)} // 게시글 알림 클릭 시
        >
            {/* 프로필 이미지 */}
            <img
                src={notification.profileImage}
                alt={notification.username}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
                onClick={goToProfile}
            />

            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">
                    {notification.actorUserId && (
                        <span
                            className="font-semibold cursor-pointer hover:underline"
                            onClick={goToProfile}
                        >
                            {notification.actorUserId}
                        </span>
                    )}
                    <span className="ml-1">{notification.action}</span>
                </p>

                {/* 댓글 미리보기 */}
                {notification.type === "COMMENT" && notification.preview && (
                    <p className="text-sm text-gray-600 truncate">
                        "{notification.preview}"
                    </p>
                )}

                {/* FOLLOW_REQUEST → 승인 / 거절 버튼 */}
                {notification.type === "FOLLOW_REQUEST" && (
                    <div className="mt-2 flex space-x-2">
                        <button
                            onClick={handleAccept}
                            className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            승인
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-3 py-1 text-xs rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                        >
                            거절
                        </button>
                    </div>
                )}

                {/* 시간 */}
                <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                </p>
            </div>
        </div>
    );
};
