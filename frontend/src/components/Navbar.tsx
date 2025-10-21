import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { HomeIconActive } from "@/components/icons/HomeIconActive";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { Chatting } from "@/components/icons/Chatting";
import { ChattingActive } from "@/components/icons/ChattingActive";
import { BellIcon } from "@/components/icons/BellIcon";
import { BellIconActive } from "@/components/icons/BellIconActive";
import { AddPostIcon } from "@/components/icons/AddPostIcon";
import { AddPostIconActive } from "@/components/icons/AddPostIconActive";
import { UploadModalHook } from "@/hooks/UploadModalHook";
import UploadModal from "@/modals/UploadModal";
import { useState, useEffect, useRef } from "react";
import { SearchSidebar } from "@/components/SearchSidebar";
import { NotificationSidebar } from "@/components/NotificationSidebar";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { PostDetailModal } from "@/modals/PostDetailModal";
import { fetchPosts } from "@/services/postService";
import { useChat } from "@/data/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/UIContext";

export default function Navbar() {
    const location = useLocation();
    const modal = UploadModalHook();
    const { isOpen, setIsOpen } = modal;
    const navbarRef = useRef<HTMLDivElement>(null);

    const {
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen
    } = useUI();

    const [hasUnread, setHasUnread] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const { id: myUserId } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [highlightCommentId, setHighlightCommentId] = useState<number | null>(null);

    useEffect(() => {
        fetchPosts().then((data) => setPosts(data));
    }, []);

    const openPostDetailModal = async ({
                                           postId,
                                           highlightCommentId,
                                       }: {
        postId: number;
        highlightCommentId?: number;
    }) => {
        let post = posts.find((p) => p.id === postId);
        if (!post) {
            try {
                const res = await api.get(`/api/posts/${postId}`);
                post = res.data;
            } catch (err) {
                console.error("❌ 게시글 불러오기 실패:", err);
                return;
            }
        }
        setSelectedPost(post);
        setHighlightCommentId(highlightCommentId ?? null);
    };

    const { unreadRooms } = useChat();

    useEffect(() => {
        const checkUnread = async () => {
            try {
                const res = await api.get("/api/notifications");
                setNotifications(res.data);
                const hasUnreadNoti = res.data.some((n: any) => !n.isRead);
                setHasUnread(hasUnreadNoti);
            } catch (err) {
                console.error("❌ 초기 알림 불러오기 실패", err);
            }
        };
        checkUnread();
    }, []);

    // ✅ 페이지 이동 시 자동으로 모든 탭 닫기
    useEffect(() => {
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
    }, [location.pathname]);

    // ✅ 탭 제어: 하나만 열리도록
    const handleTabClick = (target: "search" | "notification" | "none") => {
        if (target === "search") {
            setIsSearchOpen(!isSearchOpen);
            setIsNotificationOpen(false);
        } else if (target === "notification") {
            setIsNotificationOpen(!isNotificationOpen);
            setIsSearchOpen(false);
        } else {
            setIsSearchOpen(false);
            setIsNotificationOpen(false);
        }
    };

    // ✅ 알림 버튼 핸들러
    const handleNotificationClick = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const isMobile = window.innerWidth < 1024;

        if (isMobile && isNotificationOpen) return;

        const nextOpen = isMobile ? true : !isNotificationOpen;
        handleTabClick("notification");

        if (nextOpen) {
            try {
                const res = await api.get("/api/notifications");
                setNotifications(res.data);
                await api.patch("/api/notifications/read-all");
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                setHasUnread(false);
            } catch (err) {
                console.error("❌ 알림 열기/읽음 처리 실패", err);
            }
        }
    };

    const isMessagesPage = location.pathname.startsWith("/ChatPage");
    const isMessages = location.pathname.startsWith("/messages");
    const isAnySidebarOpen =
        isSearchOpen || isNotificationOpen || isMessagesPage || isMessages;

    const menuItems = [
        { to: "/", label: "홈", icon: HomeIcon, activeIcon: HomeIconActive },
        { label: "검색", icon: SearchIcon, activeIcon: SearchIcon, isSearch: true },
        {
            to: "/ChatPage",
            label: "메시지",
            icon: Chatting,
            activeIcon: ChattingActive,
            isMessages: true,
        },
        {
            label: "알림",
            icon: BellIcon,
            activeIcon: BellIconActive,
            isNotification: true,
        },
        {
            to: "/posts",
            label: "기록",
            icon: AddPostIcon,
            activeIcon: AddPostIconActive,
        },
        { to: "/profile", label: "프로필", isProfile: true },
    ];

    return (
        <>
            {/* ✅ 데스크탑 Navbar */}
            <motion.nav
                ref={navbarRef}
                initial={{ width: 256 }}
                animate={{ width: isAnySidebarOpen ? 92 : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:fixed lg:left-0 lg:top-16 lg:h-screen
                    lg:bg-white lg:border-r lg:border-gray-200 lg:p-4 lg:flex lg:flex-col
                    z-50"
            >
                <div className="flex flex-col h-full space-y-2 flex-1">
                    {menuItems.map(
                        ({
                             to,
                             label,
                             icon: Icon,
                             isSearch,
                             isNotification,
                             isProfile,
                             isMessages,
                         }) => {
                            const isActive = location.pathname === to;

                            if (isSearch) {
                                return (
                                    <button
                                        key={label}
                                        onClick={() => handleTabClick("search")}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-black"
                                    >
                                        <Icon className="w-6 h-6 flex-shrink-0" />
                                        {!isAnySidebarOpen && <span>{label}</span>}
                                    </button>
                                );
                            }

                            if (isNotification) {
                                return (
                                    <button
                                        key={label}
                                        onClick={handleNotificationClick}
                                        className="flex items-center gap-3.5 px-4 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-black relative"
                                    >
                                        <Icon className="w-6 h-6 flex-shrink-0" />
                                        {!isAnySidebarOpen && <span>{label}</span>}
                                        {hasUnread && (
                                            <span className="absolute left-8 top-2 w-2 h-2 bg-red-500 rounded-full" />
                                        )}
                                    </button>
                                );
                            }

                            if (to === "/posts") {
                                return (
                                    <button
                                        key={to}
                                        onClick={() => {
                                            handleTabClick("none");
                                            setIsOpen(true);
                                        }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
                                            isActive
                                                ? "text-black bg-gray-100 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                        }`}
                                    >
                                        {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
                                        {!isAnySidebarOpen && <span>{label}</span>}
                                    </button>
                                );
                            }

                            if (isMessages) {
                                return (
                                    <Link
                                        key={to}
                                        to={to!}
                                        onClick={() => handleTabClick("none")}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-black relative"
                                    >
                                        <Icon className="w-6 h-6 flex-shrink-0" />
                                        {!isAnySidebarOpen && <span>{label}</span>}
                                        {unreadRooms > 0 && (
                                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center
                                                text-xs font-bold text-white bg-red-500 rounded-full opacity-90"
                                            >
                                                {unreadRooms}
                                            </span>
                                        )}
                                    </Link>
                                );
                            }

                            if (isProfile) {
                                return (
                                    <Link
                                        key="desktop-profile"
                                        to={to!}
                                        onClick={() => handleTabClick("none")}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:text-black ${
                                            isActive
                                                ? "text-black bg-gray-100 font-semibold"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                        }`}
                                    >
                                        <img
                                            src={currentUser?.profileImage || "https://via.placeholder.com/40"}
                                            alt="프로필"
                                            className="w-7 h-7 rounded-full object-cover"
                                        />
                                        {!isAnySidebarOpen && <span>{label}</span>}
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={to}
                                    to={to!}
                                    onClick={() => handleTabClick("none")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:text-black ${
                                        isActive
                                            ? "text-black bg-gray-100 font-semibold"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                    }`}
                                >
                                    {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
                                    {!isAnySidebarOpen && <span>{label}</span>}
                                </Link>
                            );
                        }
                    )}
                </div>
            </motion.nav>

            {/* ✅ 데스크탑용 사이드바 */}
            <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={isSearchOpen ? { x: 92, opacity: 1 } : { x: -320, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="hidden lg:block fixed top-16 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 shadow-md z-40"
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <SearchSidebar navbarRef={navbarRef} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                </div>
            </motion.div>

            <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={isNotificationOpen ? { x: 92, opacity: 1 } : { x: -320, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="hidden lg:block fixed top-16 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 shadow-md z-40"
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <NotificationSidebar
                        isOpen={isNotificationOpen}
                        onClose={() => setIsNotificationOpen(false)}
                        notifications={notifications}
                        setNotifications={setNotifications}
                        openPostDetailModal={openPostDetailModal}
                        navbarRef={navbarRef}
                    />
                </div>
            </motion.div>

            {/* ✅ 모바일 전체화면 오버레이 */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white z-50 overflow-y-auto lg:hidden"
                    >
                        <SearchSidebar
                            navbarRef={navbarRef}
                            isOpen={isSearchOpen}
                            onClose={() => setIsSearchOpen(false)}
                        />
                    </motion.div>
                )}
                {isNotificationOpen && (
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-16 left-0 right-0 bottom-0 bg-white z-50 p-4 overflow-y-auto lg:hidden"
                    >
                        <NotificationSidebar
                            isOpen={isNotificationOpen}
                            onClose={() => setIsNotificationOpen(false)}
                            notifications={notifications}
                            setNotifications={setNotifications}
                            openPostDetailModal={openPostDetailModal}
                            navbarRef={navbarRef}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <PostDetailModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                post={selectedPost}
                highlightCommentId={highlightCommentId}
            />

            {/* ✅ 모바일 하단바 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-14 z-50 lg:hidden">
                {menuItems.map(({ to, label, icon: Icon, isSearch, isNotification, isProfile, isMessages }) => {
                    const isActive = location.pathname === to;
                    if (isSearch)
                        return (
                            <button
                                key={label}
                                onClick={() => handleTabClick("search")}
                                className="flex flex-col items-center justify-center text-gray-700 hover:text-black"
                            >
                                <Icon className="w-6 h-6" />
                            </button>
                        );
                    if (isNotification)
                        return (
                            <button
                                key={label}
                                onClick={handleNotificationClick}
                                className="relative flex flex-col items-center justify-center text-gray-700 hover:text-black"
                            >
                                <Icon className="w-6 h-6" />
                                {hasUnread && <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full" />}
                            </button>
                        );
                    if (to === "/posts")
                        return (
                            <button
                                key={to}
                                onClick={() => {
                                    handleTabClick("none");
                                    setIsOpen(true);
                                }}
                                className={`flex flex-col items-center justify-center ${
                                    isActive ? "text-black" : "text-gray-700"
                                } hover:text-black`}
                            >
                                {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
                            </button>
                        );
                    if (isMessages)
                        return (
                            <Link
                                key={to}
                                to={to!}
                                onClick={() => handleTabClick("none")}
                                className="relative flex flex-col items-center justify-center text-gray-700 hover:text-black"
                            >
                                <Icon className="w-6 h-6" />
                                {unreadRooms > 0 && (
                                    <span className="absolute top-1 right-3 min-w-[16px] h-[16px] text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                                        {unreadRooms}
                                    </span>
                                )}
                            </Link>
                        );
                    if (isProfile)
                        return (
                            <Link
                                key="mobile-profile"
                                to={to!}
                                onClick={() => handleTabClick("none")}
                                className="flex flex-col items-center justify-center hover:text-black"
                            >
                                <img
                                    src={currentUser?.profileImage || "https://via.placeholder.com/40"}
                                    alt="프로필"
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            </Link>
                        );
                    return (
                        <Link
                            key={to}
                            to={to!}
                            onClick={() => handleTabClick("none")}
                            className={`flex flex-col items-center justify-center hover:text-black ${
                                isActive ? "text-black" : "text-gray-700"
                            }`}
                        >
                            {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
                        </Link>
                    );
                })}
            </nav>

            <UploadModal modal={modal} />
        </>
    );
}
