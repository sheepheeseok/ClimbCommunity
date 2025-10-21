import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { useProfileNavigation } from "@/hooks/useProfileNavigation";

interface RecentSearch {
    id: number;
    userId: string;
    username: string;
    avatar: string;
}

interface UserResult {
    id: number;
    userId: string;
    username: string;
    profileImage: string | null;
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
    navbarRef: React.RefObject<HTMLDivElement | null>;
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                navbarRef,
                                                            }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);
    const { goToProfile } = useProfileNavigation();

    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
        try {
            const saved = localStorage.getItem("recentSearches");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ✅ localStorage 동기화
    useEffect(() => {
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }, [recentSearches]);

    // ✅ 바깥 클릭 감지
    useEffect(() => {
        let allowClose = false;
        const timer = setTimeout(() => {
            allowClose = true;
        }, 300); // 렌더 후 0.3초간 외부 클릭 무시

        const handleClickOutside = (event: MouseEvent) => {
            if (!allowClose) return; // 👈 이 줄이 핵심

            if (!(event.target instanceof Node)) return;
            const sidebar = sidebarRef.current;
            const navbar = navbarRef.current;
            if (sidebar?.contains(event.target) || navbar?.contains(event.target)) return;
            onClose();
        };

        if (isOpen) document.addEventListener("click", handleClickOutside, false);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, [isOpen, onClose, navbarRef]);

    // ✅ 검색 API 호출 (디바운스)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.get<UserResult[]>("/api/users/search", {
                    params: { query: searchQuery },
                });
                setResults(res.data);
            } catch (err) {
                console.error("검색 API 오류:", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const handleSelectUser = (user: UserResult) => {
        setRecentSearches((prev) => {
            const filtered = prev.filter((item) => item.id !== user.id);
            return [
                {
                    id: user.id,
                    userId: user.userId,
                    username: user.username,
                    avatar: user.profileImage || "/default-avatar.png",
                },
                ...filtered,
            ];
        });

        setSearchQuery("");
        setResults([]);
    };

    const removeSearchItem = (id: number) =>
        setRecentSearches((prev) => prev.filter((item) => item.id !== id));

    const clearAllSearches = () => setRecentSearches([]);

    const isMobile = window.innerWidth < 1024;

    return (
        <div
            ref={sidebarRef}
            onClick={(e) => e.stopPropagation()}
            className={`${
                isMobile
                    ? "fixed inset-0 bg-white z-[9999] p-6 overflow-y-auto"
                    : "p-6 h-full flex flex-col"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">검색</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
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

            <div className="border-t border-gray-200 mb-6"></div>

            <div className="flex-1 overflow-y-auto">
                {searchQuery ? (
                    loading ? (
                        <p className="text-center text-gray-400">검색 중...</p>
                    ) : results.length > 0 ? (
                        <div className="space-y-3">
                            {results.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={(e) => {
                                        handleSelectUser(user);
                                        goToProfile(e, user.userId);
                                        onClose();
                                    }}
                                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                >
                                    <img
                                        src={user.profileImage || "/default-avatar.png"}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{user.userId}</p>
                                        <p className="text-sm text-gray-500">{user.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">검색 결과 없음</p>
                    )
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                최근 검색 항목
                            </h3>
                            {recentSearches.length > 0 && (
                                <button
                                    onClick={clearAllSearches}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                                >
                                    모두 지우기
                                </button>
                            )}
                        </div>

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
                                        onClick={(e) => {
                                            goToProfile(e, item.userId);
                                            onClose();
                                        }}
                                        className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img
                                                    src={item.avatar || "/default-avatar.png"}
                                                    alt={item.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {item.userId}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {item.username}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSearchItem(item.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                                        >
                                            <CloseIcon className="text-gray-400 hover:text-gray-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
