// components/CommentOptionsModal.tsx
import React, { useEffect } from "react";
import api from "@/lib/axios";

interface CommentOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isOwner: boolean;
    postId: number;
    commentId: number;
    onDeleted: () => void;   // 삭제 후 부모 리프레시용
}

export const CommentOptionsModal: React.FC<CommentOptionsModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            isOwner,
                                                                            postId,
                                                                            commentId,
                                                                            onDeleted,
                                                                        }) => {
    // ✅ 모달 열릴 때 스크롤 잠금 + 닫을 때 복구
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
        } else {
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "auto";
            if (top) {
                window.scrollTo(0, parseInt(top || "0") * -1);
            }
        }
        return () => {
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "auto";
            if (top) {
                window.scrollTo(0, parseInt(top || "0") * -1);
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // ✅ 댓글 삭제
    const handleDelete = async () => {
        try {
            await api.delete(`/api/posts/${postId}/comments/${commentId}`);
            onDeleted();   // 부모에 알림 → 리스트 갱신
            onClose();
        } catch (err) {
            console.error("❌ 댓글 삭제 실패:", err);
        }
    };

    // ✅ 댓글 신고
    const handleReport = async () => {
        try {
            await api.post(`/api/posts/${postId}/comments/${commentId}/report`, {
                reason: "부적절한 댓글입니다.", // 👉 선택적으로 수정 가능
            });
            alert("🚨 댓글이 신고되었습니다.");
            onClose();
        } catch (err) {
            console.error("❌ 댓글 신고 실패:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-[45rem] overflow-hidden">
                {isOwner ? (
                    <>
                        {/* 본인 댓글 */}
                        <button
                            onClick={handleDelete}
                            className="w-full py-3 text-red-600 font-semibold border-b border-gray-200 hover:bg-gray-50"
                        >
                            삭제
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-800 border-b border-gray-200 hover:bg-gray-50"
                        >
                            수정
                        </button>
                    </>
                ) : (
                    <>
                        {/* 다른 사람 댓글 */}
                        <button
                            onClick={handleReport}
                            className="w-full py-3 text-red-600 font-semibold border-b border-gray-200 hover:bg-gray-50"
                        >
                            신고
                        </button>
                    </>
                )}
                <button
                    onClick={onClose}
                    className="w-full py-3 text-gray-800 hover:bg-gray-50"
                >
                    취소
                </button>
            </div>
        </div>
    );
};
