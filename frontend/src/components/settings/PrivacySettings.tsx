import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";

export const PrivacySettings: React.FC = () => {
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [pendingValue, setPendingValue] = useState<boolean | null>(null);

    // ✅ 현재 공개 상태 불러오기
    useEffect(() => {
        api.get("/api/users/me/privacy")
            .then((res) => setIsPrivate(res.data.isPrivate))
            .catch(() => setIsPrivate(false));
    }, []);

    // ✅ 변경 확인 (PATCH)
    const handleConfirm = async () => {
        if (pendingValue === null) return;
        try {
            await api.patch("/api/users/me/privacy", { isPrivate: pendingValue });
            setIsPrivate(pendingValue);
        } catch (err) {
            console.error("공개 설정 변경 실패:", err);
        } finally {
            setShowModal(false);
            setPendingValue(null);
        }
    };

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

            {/* ✅ 기존 디자인 그대로 유지 */}
            <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900">계정 유형</h3>

                <label className="flex items-center space-x-3">
                    <input
                        type="radio"
                        name="accountType"
                        value="public"
                        checked={!isPrivate}
                        onChange={() => {
                            if (isPrivate) {
                                setPendingValue(false);
                                setShowModal(true);
                            }
                        }}
                    />
                    <span className="text-black">공개 계정</span>
                </label>

                <label className="flex items-center space-x-3">
                    <input
                        type="radio"
                        name="accountType"
                        value="private"
                        checked={isPrivate}
                        onChange={() => {
                            if (!isPrivate) {
                                setPendingValue(true);
                                setShowModal(true);
                            }
                        }}
                    />
                    <span className="text-black">비공개 계정</span>
                </label>
            </div>

            {/* ✅ 중앙 팝업 */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-8 w-[360px] text-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3 className="text-lg font-semibold mb-4 text-black">
                                {pendingValue
                                    ? "비공개 계정으로 전환하시겠습니까?"
                                    : "공개 계정으로 전환하시겠습니까?"}
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm leading-6">
                                {pendingValue
                                    ? "비공개 계정으로 전환하면 승인된 팔로워만 회원님의 게시물을 볼 수 있습니다."
                                    : "공개 계정으로 전환하면 누구나 회원님의 게시물을 볼 수 있습니다."}
                            </p>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    확인
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
