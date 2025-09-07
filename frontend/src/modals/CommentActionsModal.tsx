import React, {useState} from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    isOwner: boolean; // 본인 댓글 여부
    onDelete: () => void;
    onReport: () => void;
};

export default function CommentActionsModal({
                                                isOpen,
                                                onClose,
                                                isOwner,
                                                onDelete,
                                                onReport,
                                            }: Props) {
    const [ reportOpen, setReportOpen ] = useState(false);
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white w-[40rem] rounded-2xl overflow-hidden shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {isOwner ? (
                    <button
                        onClick={() => {
                            onDelete();
                            onClose();
                        }}
                        className="w-full py-3 text-red-500 font-semibold hover:bg-gray-100"
                    >
                        삭제
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            onReport();
                        }}
                        className="w-full py-3 text-red-500 font-semibold hover:bg-gray-100"
                    >
                        신고
                    </button>
                )}

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
