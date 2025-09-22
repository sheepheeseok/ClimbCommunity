// src/components/chat/ChatList.tsx
import { useState } from "react";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { motion } from "framer-motion";

interface Props {
    conversations: any[];
    activeChat: any;
    onChatSelect: (conv: any) => void;
}

export function ChatList({ conversations, activeChat, onChatSelect }: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col flex-1 h-full min-h-0"> {/* ✅ 전체 영역 차지 */}
            {/* 검색창 */}
            <div className="p-4 border-b border-gray-100 shrink-0"> {/* ✅ 고정 */}
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="대화 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 text-black pr-4 py-3 bg-gray-50 rounded-2xl border-0
                                   focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* 대화 리스트 */}
            <div className="flex-1 overflow-y-auto bg-white w-80 max-w-80 border-r"> {/* ✅ 스크롤 가능 */}
                {filteredConversations.map((conv) => (
                    <motion.button
                        key={conv.roomId}
                        onClick={() => onChatSelect(conv)}
                        className={`w-full p-4 flex items-center space-x-3
                                    hover:bg-gray-50 transition-colors
                                    ${activeChat?.roomId === conv.roomId ? "bg-blue-50" : ""}`}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        <img
                            src={conv.profileImage}
                            alt={conv.username}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                    {conv.username}
                                </h3>
                                <span className="text-xs text-gray-500"> {conv.timestamp
                                    ? new Date(conv.timestamp).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })
                                    : ""}</span>
                            </div>
                            <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"}`}>
                                {conv.lastMessage || "대화 없음"}
                            </p>
                        </div>
                        {conv.unreadCount > 0 && (
                            <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                                {conv.unreadCount}
                            </div>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
