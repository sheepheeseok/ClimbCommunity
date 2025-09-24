import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { UserList } from "@/components/UserList";

// ✅ User 타입을 UserList와 동일하게 맞춤
interface User {
    userId: string;
    username: string;
    profileImage: string;
    following: boolean;   // ✅ 통일
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: User[];
    onToggleFollow: (userId: string, following: boolean) => void; // ✅ 파라미터명도 맞춤
}

export const FollowersModal: React.FC<Props> = ({
                                                    isOpen,
                                                    onClose,
                                                    title,
                                                    users,
                                                    onToggleFollow,
                                                }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(
                users.filter(
                    (u) =>
                        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.userId.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, users]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="w-6" />
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 text-black pr-4 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="max-h-[70vh] overflow-y-auto">
                    <UserList users={filteredUsers} onToggleFollow={onToggleFollow} />
                </div>
            </div>
        </div>
    );
};
