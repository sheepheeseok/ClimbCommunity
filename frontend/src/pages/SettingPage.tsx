import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    ProfileEditContent,
    NotificationSettingsContent,
    PrivacySettingsContent,
    BlockedAccountsContent,
} from "@/components/settings";

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "프로필 편집" },
        { id: "notifications", label: "알림 설정" },
        { id: "privacy", label: "계정 공개 범위" },
        { id: "blocked", label: "차단된 계정" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileEditContent />;
            case "notifications":
                return <NotificationSettingsContent />;
            case "privacy":
                return <PrivacySettingsContent />;
            case "blocked":
                return <BlockedAccountsContent />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 좌측 탭 */}
            <div className="w-80 bg-white border-r">
                <h1 className="text-3xl font-bold p-6">설정</h1>
                <nav className="space-y-2 px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-3 text-black rounded-lg ${
                                activeTab === tab.id ? "bg-gray-100 text-black font-semibold" : "hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* 콘텐츠 */}
            <div className="flex-1 p-8">
                <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </div>
        </div>
    );
};
