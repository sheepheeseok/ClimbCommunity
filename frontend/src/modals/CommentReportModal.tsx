import React from "react";
import api from "@/lib/axios";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    postId: number;
    commentId: number;
    onReported: () => void;
};

const REPORT_REASONS = [
    "마음에 들지 않습니다",
    "따돌림 또는 원치 않는 연락",
    "자살, 자해 및 섭식 장애",
    "나체 이미지 또는 성적 행위",
    "혐오 발언 또는 상징",
    "폭력 또는 학대",
    "규제 품목을 판매하거나 홍보함",
    "스캠, 사기 또는 스팸",
    "거짓 정보",
];

export default function CommentReportModal({
                                               isOpen,
                                               onClose,
                                               postId,
                                               commentId,
                                               onReported,
                                           }: Props) {
    if (!isOpen) return null;

    const handleReport = async (reason: string) => {
        try {
            await api.post(`/api/posts/${postId}/comments/${commentId}/report`, {
                reason,
            });
            onReported();
            onClose();
        } catch (err) {
            console.error("댓글 신고 실패:", err);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white w-[30rem] rounded-2xl overflow-hidden shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-center font-semibold py-4 border-b text-black">
                    이 댓글을 신고하는 이유
                </h3>
                <div className="divide-y">
                    {REPORT_REASONS.map((reason) => (
                        <button
                            key={reason}
                            onClick={() => handleReport(reason)}
                            className="w-full py-3 px-4 text-left text-gray-700 hover:bg-gray-100"
                        >
                            {reason}
                        </button>
                    ))}
                </div>
                <div className="border-t" />
                <button
                    onClick={onClose}
                    className="w-full py-3 text-gray-700 hover:bg-gray-100"
                >
                    취소
                </button>
            </div>
        </div>
    );
}
