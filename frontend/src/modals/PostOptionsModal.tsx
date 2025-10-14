import React, { useEffect } from "react";

interface PostOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    onEdit?: () => void;
    onReport: () => void;
    isOwner: boolean;
}

export const PostOptionsModal: React.FC<PostOptionsModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      onDelete,
                                                                      onEdit,
                                                                      onReport,
                                                                      isOwner,
                                                                  }) => {
    // ✅ 모달 열릴 때 스크롤 잠금
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

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-[90%] max-w-md overflow-hidden shadow-lg animate-fadeIn">
                {isOwner ? (
                    <>
                        {/* 🔹 수정 */}
                        <button
                            onClick={() => {
                                onEdit?.();
                                onClose();
                            }}
                            className="w-full py-3 border-b text-sm border-gray-200 hover:bg-gray-50"
                        >
                            수정하기
                        </button>

                        {/* 🔹 삭제 */}
                        <button
                            onClick={() => {
                                onDelete();
                                onClose();
                            }}
                            className="w-full py-3 text-red-600 text-sm border-b border-gray-200 hover:bg-gray-50"
                        >
                            삭제하기
                        </button>
                    </>
                ) : (
                    <>
                        {/* 🔹 신고 */}
                        <button
                            onClick={() => {
                                onReport();
                                onClose();
                            }}
                            className="w-full py-3 text-red-600 text-sm border-b border-gray-200 hover:bg-gray-50"
                        >
                            신고하기
                        </button>
                    </>
                )}

                {/* 🔹 취소 */}
                <button
                    onClick={onClose}
                    className="w-full py-3 text-gray-800 text-sm hover:bg-gray-50"
                >
                    취소
                </button>
            </div>
        </div>
    );
};
