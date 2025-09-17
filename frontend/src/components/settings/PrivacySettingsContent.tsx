import React from "react";
import { motion } from "framer-motion";

export const PrivacySettingsContent: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <h2 className="text-2xl font-bold text-gray-900">계정 공개 범위</h2>
            <p className="text-gray-600">
                계정의 공개/비공개 여부와 스토리, 메시지 권한을 설정할 수 있습니다.
            </p>

            <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900">계정 유형</h3>
                <label className="flex items-center space-x-3">
                    <input type="radio" name="accountType" value="public" defaultChecked />
                    <span>공개 계정</span>
                </label>
                <label className="flex items-center space-x-3">
                    <input type="radio" name="accountType" value="private" />
                    <span>비공개 계정</span>
                </label>
            </div>
        </motion.div>
    );
};
