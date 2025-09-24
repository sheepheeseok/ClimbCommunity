import React, { useEffect, useState } from "react";
import { followService } from "@/services/followService";

// ✅ 재사용 가능한 타입으로 정의
export interface UserWithFollowing {
    userId: string;
    username: string;
    profileImage: string;
    following: boolean; // 서버에서 내려오는 값
}

interface UserListProps {
    users: UserWithFollowing[];
    onToggleFollow: (userId: string, following: boolean) => void; // ✅ 부모에서 제어
}

export const UserList: React.FC<UserListProps> = ({ users, onToggleFollow }) => {
    const [localUsers, setLocalUsers] = useState<UserWithFollowing[]>(users);

    // ✅ props.users가 갱신되면 localUsers도 갱신
    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

    const toggleFollow = async (targetUserId: string, following: boolean) => {
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
        } catch (err) {
            console.error("팔로우/언팔로우 실패:", err);
        }
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
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                            src={user.profileImage}
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
                        onClick={() => toggleFollow(user.userId, user.following)}
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
