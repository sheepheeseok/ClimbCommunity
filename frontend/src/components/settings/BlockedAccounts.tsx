import React, { useState } from "react";
import { motion } from "framer-motion";

interface BlockedUser {
    id: string;
    username: string;
    name: string;
    avatar: string;
    blockedDate: string;
}

export const BlockedAccounts: React.FC = () => {
    const [blockedUsers] = useState<BlockedUser[]>([
        {
            id: "1",
            username: "spam_account",
            name: "스팸 계정",
            avatar:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
            blockedDate: "2024년 1월 10일",
        },
    ]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <h2 className="text-2xl font-bold text-gray-900">차단된 계정</h2>
            <p className="text-gray-600">
                차단한 계정을 관리하고 필요하면 해제할 수 있습니다.
            </p>

            <div className="bg-white rounded-xl border shadow-sm divide-y">
                {blockedUsers.length > 0 ? (
                    blockedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4"
                        >
                            <div className="flex text-black items-center space-x-4">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.name}</p>
                                    <p className="text-xs text-gray-400">
                                        차단일: {user.blockedDate}
                                    </p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
                                차단 해제
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        차단된 계정이 없습니다.
                    </div>
                )}
            </div>
        </motion.div>
    );
};
