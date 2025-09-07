import React, { useState } from "react";

interface RecentSearch {
    id: number;
    username: string;
    description: string;
    avatar: string;
}

const SearchIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg
        className={className}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

interface SearchSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
        {
            id: 1,
            username: "johndoe",
            description: "존 도 • 팔로우",
            avatar:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
        {
            id: 2,
            username: "sarahkim",
            description: "사라 김 • 팔로우",
            avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        },
    ]);

    const removeSearchItem = (id: number) => {
        setRecentSearches(recentSearches.filter((item) => item.id !== id));
    };

    const clearAllSearches = () => setRecentSearches([]);

    return (
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">검색</h2>
                    <button onClick={onClose}>
                        <CloseIcon className="text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* Input */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 text-black py-3 bg-gray-100 border-0 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-6"></div>

                {/* Recent */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">최근 검색 항목</h3>
                    {recentSearches.length > 0 && (
                        <button
                            onClick={clearAllSearches}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                            모두 지우기
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {recentSearches.length === 0 ? (
                        <div className="text-center py-8">
                            <SearchIcon className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">최근 검색 항목이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentSearches.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.avatar}
                                                alt={item.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{item.username}</p>
                                            <p className="text-sm text-gray-500 truncate">{item.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSearchItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                                    >
                                        <CloseIcon className="text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
    );
};
