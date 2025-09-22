import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToggleSwitch } from "@/components/icons/ToggleSwitch";

export const NotificationSettings: React.FC = () => {
    const [notifications, setNotifications] = useState({ likes: true, comments: false });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <h2 className="text-2xl text-black font-bold">알림 설정</h2>
            <div className="flex items-center text-black justify-between">
                <span>좋아요 알림</span>
                <ToggleSwitch
                    enabled={notifications.likes}
                    onChange={(v) => setNotifications({ ...notifications, likes: v })}
                />
            </div>
        </motion.div>
    );
};
