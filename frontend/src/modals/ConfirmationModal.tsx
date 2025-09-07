// src/modals/ConfirmationModal.tsx
import React, { useEffect } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
};

const CheckmarkIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`relative ${className}`}>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20,6 9,17 4,12" />
            </svg>
        </div>
    </div>
);

export default function ConfirmationModal({ isOpen, onClose, userId }: Props) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-[10002] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <CheckmarkIcon />
                    </div>

                    {/* Main Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                        이 내용을 보고 싶지 않으세요?
                    </h2>

                    {/* Sub Text */}
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed px-2">
                        신고된 댓글은 커뮤니티 가이드라인 위반 시 <br />
                        검토 후 삭제될 수 있습니다.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-3 mb-8">
                        <button
                            onClick={() => {
                                console.log(`${userId} 차단`);
                                onClose();
                            }}
                            className="w-full py-3 px-4 border border-blue-200 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors duration-200 font-medium"
                        >
                            {userId}님 차단
                        </button>

                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
