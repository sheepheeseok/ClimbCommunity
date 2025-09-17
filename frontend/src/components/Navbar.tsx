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
import { useState, useEffect } from "react";
import { SearchSidebar } from "@/components/SearchSidebar";
import { NotificationSidebar } from "@/components/NotificationSidebar";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function Navbar() {
    const location = useLocation();
    const modal = UploadModalHook();
    const { isOpen, setIsOpen } = modal;

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

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

    const handleNotificationClick = async () => {
        const nextOpen = !isNotificationOpen;
        setIsNotificationOpen(nextOpen);

        if (nextOpen) {
            try {
                // 1. 알림 가져오기
                const res = await api.get("/api/notifications");
                console.log("📥 [Navbar] 알림 데이터:", res.data);
                setNotifications(res.data);

                // 2. 열자마자 전체 읽음 처리
                await api.patch("/api/notifications/read-all");
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

                // 3. 새 알림 배지 제거
                setHasUnread(false);

                // 검색 사이드바 닫기
                if (isSearchOpen) setIsSearchOpen(false);
            } catch (err) {
                console.error("❌ 알림 열기/읽음 처리 실패", err);
            }
        }
    };

    // ✅ 사이드바 열림 여부 → Navbar width 제어
    const isAnySidebarOpen = isSearchOpen || isNotificationOpen;

    const menuItems = [
        { to: "/", label: "홈", icon: HomeIcon, activeIcon: HomeIconActive },
        { label: "검색", icon: SearchIcon, activeIcon: SearchIcon, isSearch: true },
        { to: "/messages", label: "메시지", icon: Chatting, activeIcon: ChattingActive },
        { label: "알림", icon: BellIcon, activeIcon: BellIconActive, isNotification: true },
        { to: "/posts", label: "기록", icon: AddPostIcon, activeIcon: AddPostIconActive },
    ];

    return (
        <>
            {/* ✅ 데스크탑 Navbar */}
            <motion.nav
                initial={{ width: 256 }}
                animate={{ width: isAnySidebarOpen ? 92 : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:fixed lg:left-0 lg:top-16 lg:h-screen
                    lg:bg-white lg:border-r lg:border-gray-200 lg:p-4 lg:flex lg:flex-col
                    z-50"
            >
                <div className="flex flex-col h-full space-y-2 flex-1">
                    {menuItems.map(({ to, label, icon: Icon, activeIcon: ActiveIcon, isSearch, isNotification }) => {
                        const isActive = location.pathname === to;

                        // ✅ 검색 버튼
                        if (isSearch) {
                            return (
                                <button
                                    key={`desktop-${label}`}
                                    onClick={() => {
                                        setIsSearchOpen(!isSearchOpen);
                                        if (isNotificationOpen) setIsNotificationOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-black"
                                >
                                    <Icon className="w-6 h-6 flex-shrink-0" />
                                    {!isAnySidebarOpen && <span>{label}</span>}
                                </button>
                            );
                        }

                        // ✅ 알림 버튼
                        if (isNotification) {
                            return (
                                <button
                                    key={`desktop-${label}`}
                                    onClick={handleNotificationClick}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-black relative"
                                >
                                    <Icon className="w-6 h-6 flex-shrink-0" />
                                    {!isAnySidebarOpen && <span>{label}</span>}
                                    {hasUnread && (
                                        <span className="absolute left-8 top-2 w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </button>
                            );
                        }

                        // ✅ 업로드 버튼
                        if (to === "/posts") {
                            return (
                                <button
                                    key={`desktop-${to}`}
                                    onClick={() => setIsOpen(true)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
                                        isActive
                                            ? "text-black bg-gray-100 font-semibold"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                    }`}
                                >
                                    <Icon className="w-6 h-6 flex-shrink-0" />
                                    {!isAnySidebarOpen && <span>{label}</span>}
                                </button>
                            );
                        }

                        // ✅ 일반 메뉴
                        return (
                            <Link
                                key={`desktop-${to}`}
                                to={to!}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
                                    isActive
                                        ? "text-black bg-gray-100 font-semibold"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-black"
                                }`}
                            >
                                <Icon className="w-6 h-6 flex-shrink-0" />
                                {!isAnySidebarOpen && <span>{label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </motion.nav>

            {/* ✅ 검색 사이드바 */}
            <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={isSearchOpen ? { x: 92, opacity: 1 } : { x: -320, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="hidden lg:block fixed top-16 h-[calc(100vh-4rem)]
                    w-80 bg-white border-r border-gray-200 shadow-md z-40"
            >
                <SearchSidebar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </motion.div>

            {/* ✅ 알림 사이드바 */}
            <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={isNotificationOpen ? { x: 92, opacity: 1 } : { x: -320, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="hidden lg:block fixed top-16 h-[calc(100vh-4rem)]
                    w-80 bg-white border-r border-gray-200 shadow-md z-40"
            >
                <NotificationSidebar
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={notifications} // ✅ props로 전달
                    setNotifications={setNotifications}
                />
            </motion.div>

            {/* ✅ 모바일 하단바 + UploadModal */}
            <UploadModal modal={modal} />
        </>
    );
}
