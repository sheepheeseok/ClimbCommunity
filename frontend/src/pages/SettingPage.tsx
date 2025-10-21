import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    ProfileEdit,
    NotificationSettings,
    PrivacySettings,
} from "@/components/settings";

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "프로필 편집" },
        { id: "notifications", label: "알림 설정" },
        { id: "privacy", label: "계정 공개 범위" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileEdit />;
            case "notifications":
                return <NotificationSettings />;
            case "privacy":
                return <PrivacySettings />;
        }
    };

    return (
        <div
            className="
                flex flex-col sm:flex-row
                min-h-[100dvh]
                bg-gray-50
            "
            style={{
                paddingTop: "max(env(safe-area-inset-top), 0.5rem)",
                paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)",
            }}
        >
            {/* ✅ 좌측 탭 (데스크탑) / 상단 탭 (모바일) */}
            <div
                className="
                    w-full sm:w-80
                    bg-white border-b sm:border-b-0 sm:border-r
                    sticky top-0 sm:static
                    z-10
                "
            >
                <h1 className="text-2xl sm:text-3xl font-bold p-4 sm:p-6 text-black">
                    설정
                </h1>

                {/* ✅ 모바일에서는 가로 스크롤 탭 */}
                <nav
                    className="
                        flex sm:flex-col
                        gap-2 px-2 sm:px-4 pb-2 sm:pb-0
                        overflow-x-auto sm:overflow-visible
                        hide-scrollbar
                    "
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-shrink-0
                                px-4 py-2 sm:px-4 sm:py-3
                                rounded-lg font-medium
                                text-sm sm:text-base
                                transition-all duration-200
                                ${
                                activeTab === tab.id
                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* ✅ 콘텐츠 영역 */}
            <div
                className="
                    flex-1
                    p-4 sm:p-8
                    overflow-y-auto
                    min-h-[calc(100dvh-6rem)]
                    bg-gray-50
                "
            >
                <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </div>
        </div>
    );
};
