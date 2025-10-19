import React, { useEffect, useState } from "react";
import { followService } from "@/services/followService";
import { useNavigate } from "react-router-dom";

export interface UserWithFollowing {
    userId: string;
    username: string;
    profileImage: string;
    following: boolean; // 서버에서 내려오는 값
}

interface UserListProps {
    users: UserWithFollowing[];
    onToggleFollow: (userId: string, following: boolean) => void;
    onClose?: () => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onToggleFollow, onClose }) => {
    const [localUsers, setLocalUsers] = useState<UserWithFollowing[]>(users);
    const navigate = useNavigate();

    // ✅ props.users가 갱신되면 localUsers도 갱신
    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

    const toggleFollow = async (e: React.MouseEvent, targetUserId: string, following: boolean) => {
        e.stopPropagation(); // ✅ 버튼 클릭 시 프로필 이동 방지

        try {
            if (following) {
                await followService.unfollow(targetUserId);
            } else {
                await followService.follow(targetUserId);
            }

            // ✅ 토글 후 UI 즉시 반영
            setLocalUsers((prev) =>
                prev.map((user) =>
                    user.userId === targetUserId
                        ? { ...user, following: !following }
                        : user
                )
            );

            // 부모 콜백 전달
            onToggleFollow(targetUserId, !following);
        } catch (err) {
            console.error("팔로우/언팔로우 실패:", err);
        }
    };

    const handleUserClick = (userId: string) => {
        navigate(`/${userId}/profile`);
        onClose?.(); // ✅ 부모에서 전달받은 onClose 실행 (리스트 닫기)
    };

    if (localUsers.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                검색 결과가 없습니다
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100">
            {localUsers.map((user) => (
                <div
                    key={user.userId}
                    onClick={() => handleUserClick(user.userId)} // ✅ 전체 클릭 시 이동
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                            src={user.profileImage || "/default-avatar.png"}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                                {user.username}
                            </p>
                            <p className="text-gray-500 text-sm truncate">@{user.userId}</p>
                        </div>
                    </div>

                    {/* Follow Button */}
                    <button
                        onClick={(e) => toggleFollow(e, user.userId, user.following)}
                        className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
                            user.following
                                ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        {user.following ? "팔로잉" : "팔로우"}
                    </button>
                </div>
            ))}
        </div>
    );
};
