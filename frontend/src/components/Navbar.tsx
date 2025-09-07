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
import { useState } from "react";
import { SearchSidebar } from "@/components/SearchSidebar";
import { motion } from "framer-motion";


export default function Navbar() {
    const location = useLocation();
    const modal = UploadModalHook();
    const { isOpen, setIsOpen } = modal;
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const menuItems = [
        { to: "/", label: "홈", icon: HomeIcon, activeIcon: HomeIconActive },
        { label: "검색", icon: SearchIcon, activeIcon: SearchIcon, isSearch: true },
        { to: "/messages", label: "메시지", icon: Chatting, activeIcon: ChattingActive },
        { to: "/notifications", label: "알림", icon: BellIcon, activeIcon: BellIconActive },
        { to: "/posts", label: "기록", icon: AddPostIcon, activeIcon: AddPostIconActive },
    ];

    return (
        <>
            {/* ✅ 데스크탑 Navbar */}
            <motion.nav
                initial={{width: 256}} // 64px (w-64)
                animate={{width: isSearchOpen ? 92 : 256}} // 5.7rem ≈ 92px
                transition={{type: "spring", stiffness: 300, damping: 30}}
                className="hidden lg:fixed lg:left-0 lg:top-16 lg:h-screen
                   lg:bg-white lg:border-r lg:border-gray-200 lg:p-4 lg:flex lg:flex-col
                   z-50"
            >
                <div className="flex flex-col h-full space-y-2 flex-1">
                    {menuItems.map(({to, label, icon: Icon, activeIcon: ActiveIcon, isSearch}) => {
                        const isActive = location.pathname === to;

                        if (isSearch) {
                            return (
                                <button
                                    key={`desktop-${label}`}
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-black"
                                >
                                    <Icon className="w-6 h-6 flex-shrink-0"/>
                                    {!isSearchOpen && (
                                        <span className="font-normal leading-none">{label}</span>
                                    )}
                                </button>
                            );
                        }

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
                                    <Icon className="w-6 h-6 flex-shrink-0"/>
                                    {!isSearchOpen && (
                                        <span className="font-normal leading-none">{label}</span>
                                    )}
                                </button>
                            );
                        }

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
                                <Icon className="w-6 h-6 flex-shrink-0"/>
                                {!isSearchOpen && (
                                    <span className="font-normal leading-none">{label}</span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </motion.nav>

            {/* ✅ 검색 사이드바 (옆으로 슬라이드) */}
            <motion.div
                initial={{x: -320, opacity: 0}}
                animate={isSearchOpen ? {x: 92, opacity: 1} : {x: -320, opacity: 0}}
                transition={{type: "spring", stiffness: 260, damping: 30}}
                className="hidden lg:block fixed top-16 h-[calc(100vh-4rem)]
                   w-80 bg-white border-r border-gray-200 shadow-md z-40"
            >
                <SearchSidebar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}/>
            </motion.div>

            {/* ✅ 모바일 하단바 */}
            <nav
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center lg:hidden">
                {menuItems.map(({to, label, icon: Icon, activeIcon: ActiveIcon}) => {
                    const isActive = location.pathname === to;

                    if (to === "/posts") {
                        return (
                            <button
                                key={`mobile-${to}`}
                                onClick={() => setIsOpen(true)}
                                className={`flex flex-col items-center justify-center text-xs ${
                                    isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"
                                }`}
                            >
                                {isActive ? (
                                    <ActiveIcon className="w-6 h-6 mb-1"/>
                                ) : (
                                    <Icon className="w-6 h-6 mb-1"/>
                                )}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={`mobile-${to}`}
                            to={to!}
                            className={`flex flex-col items-center justify-center text-xs ${
                                isActive ? "text-black font-semibold" : "text-gray-500 hover:text-black"
                            }`}
                        >
                            {isActive ? (
                                <ActiveIcon className="w-6 h-6 mb-1"/>
                            ) : (
                                <Icon className="w-6 h-6 mb-1"/>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ✅ 모달 */}
            <UploadModal {...modal} />
        </>
    );
}
