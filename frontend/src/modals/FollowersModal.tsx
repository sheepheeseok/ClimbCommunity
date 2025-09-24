import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";

interface User {
    userId: string;
    username: string;
    profileImage: string;
    isFollowing: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: User[];
    onToggleFollow: (userId: string, isFollowing: boolean) => void;
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

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
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
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* User List */}
                    <div className="max-h-[70vh] overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <motion.div
                                        key={user.userId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                    >
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
                                                <p className="text-gray-500 text-sm truncate">
                                                    @{user.userId}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onToggleFollow(user.userId, user.isFollowing)}
                                            className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
                                                user.isFollowing
                                                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                        >
                                            {user.isFollowing ? "팔로잉" : "팔로우"}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">검색 결과가 없습니다</div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
