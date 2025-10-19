import { NotificationItem } from "@/components/NotificationItem";
import { timeAgo } from "@/utils/timeAgo";
import React, { useEffect, useRef } from "react";

export const NotificationSidebar: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    notifications: any[];
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
    openPostDetailModal: (post: any) => void;
    navbarRef: React.RefObject<HTMLDivElement | null>;
}> = ({
          isOpen,
          onClose,
          notifications,
          setNotifications,
          openPostDetailModal,
          navbarRef,
      }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    // ✅ 데스크탑에서만 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isMobile = window.innerWidth < 1024;
            if (isMobile) return; // 모바일에서는 닫히지 않음

            if (sidebarRef.current?.contains(target)) return;
            if (navbarRef.current?.contains(target)) return;

            onClose();
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, navbarRef]);

    // ✅ 게시글 / 댓글 / 태그 알림 클릭 시 게시글 열기 후 닫기
    const handleNotificationClick = (n: any) => {
        if (n.type === "LIKE") {
            openPostDetailModal({ postId: n.targetId });
        } else if (n.type === "COMMENT") {
            openPostDetailModal({
                postId: n.postId,
                highlightCommentId: n.targetId,
            });
        } else if (n.type === "TAGGED") {
            openPostDetailModal({
                postId: n.targetId,
            });
        } else if (n.type === "FOLLOW") {
            // ✅ 팔로우 알림 → 해당 유저 프로필로 이동
            window.location.href = `${n.actorUserId}/profile/`;
        }

        // ✅ 게시글 or 프로필 이동 후 닫기
        onClose();
    };

    // ✅ 닉네임 클릭 시 프로필로 이동 후 닫기
    const handleUsernameClick = () => {
        onClose();
    };

    // ✅ 알림 제거 (예: 팔로우 승인/거절 시)
    const handleRemoveNotification = (id: string) => {
        setNotifications((prev) =>
            prev.filter((n) => String(n.id) !== id)
        );
    };

    return (
        <div ref={sidebarRef} className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">알림</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    ✕
                </button>
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
                                    username: n.actorUsername || "",
                                    actorUserId: n.actorUserId,
                                    action: n.message,
                                    preview: n.preview,
                                    time: timeAgo(n.createdAt),
                                    profileImage: n.actorProfileImage,
                                    isRead: n.isRead,
                                    type: n.type,
                                    targetId: n.targetId,
                                    postId: n.postId,
                                }}
                                onClick={handleNotificationClick}
                                onUsernameClick={handleUsernameClick} // ✅ 닉네임 클릭 시 닫기
                                onRemove={handleRemoveNotification}
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
