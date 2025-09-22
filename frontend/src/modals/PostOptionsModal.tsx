// components/PostOptionsModal.tsx
import React, {useEffect} from "react";

interface PostOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    onReport: () => void;
    isOwner: boolean;
}

export const PostOptionsModal: React.FC<PostOptionsModalProps> = ({ isOpen, onClose, onDelete, onReport,
                                                                      isOwner, }) => {
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

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-[45rem] overflow-hidden">
                {isOwner ? (
                    <>
                        {/* 본인 계정인 경우 */}
                        <button
                            onClick={onDelete}
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
                        {/* 다른 사람 계정인 경우 */}
                        <button
                            onClick={onReport}
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
