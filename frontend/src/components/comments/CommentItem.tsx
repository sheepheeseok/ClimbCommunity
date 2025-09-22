import {useEffect, useRef, useState} from "react";
import { timeAgo } from "@/utils/timeAgo";
import type { Comment } from "./types";
import CommentActionsModal from "../../modals/CommentActionsModal";
import { MoreHorizontal } from "lucide-react";
import api from "@/lib/axios";
import CommentReportModal from "@/modals/CommentReportModal";
import ConfirmationModal from "@/modals/ConfirmationModal";

type Props = {
    comment: Comment;
    onReply: (comment: Comment) => void;
    postId: number;
    onDeleted: () => void;
    highlightCommentId?: number | null;
};

export default function CommentItem({ comment, onReply, postId, onDeleted, highlightCommentId }: Props) {
    const [showReplies, setShowReplies] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const isOwner = currentUser?.userId === comment.userId;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!highlightCommentId) return;

        const el = document.getElementById(`comment-${highlightCommentId}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });

            el.classList.add("transition-colors", "duration-700", "bg-blue-300/40");

            const timer = setTimeout(() => {
                el.classList.remove("bg-blue-300/40");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [highlightCommentId]);


    const handleDelete = async () => {
        try {
            await api.delete(`/api/posts/${postId}/comments/${comment.id}`);
            console.log("댓글 삭제 성공:", comment.id);
            onDeleted();
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
        }
    };

    return (
        <div
            id={`comment-${comment.id}`}   // ✅ 댓글 DOM ID 부여
            className="flex items-start space-x-3 group"
        >
            {/* 프로필 */}
            <img
                src={comment.profileImage || "/default-avatar.png"}
                alt={comment.userId}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />

            {/* 본문 */}
            <div className="flex-1">
                {/* 닉네임 + 내용 */}
                <div>
                    <span className="font-semibold text-sm text-black mr-1">
                        {comment.userId}
                    </span>
                    <span className="text-gray-800 text-[15px]">{comment.content}</span>
                </div>

                {/* 메타 정보 + ⋯ 버튼 */}
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                    <span>{timeAgo(comment.createdAt)}</span>
                    {comment.likeCount > 0 && (
                        <span>좋아요 {comment.likeCount}개</span>
                    )}
                    <button
                        className="font-medium"
                        onClick={() => onReply(comment)}
                    >
                        답글 달기
                    </button>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <MoreHorizontal size={16} className="text-gray-500" />
                    </button>
                </div>

                {/* ── 답글 보기 버튼 */}
                {comment.replies && comment.replies.length > 0 && (
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mt-3"
                    >
                        <span className="text-gray-400">──</span>
                        <span>
                            {showReplies
                                ? "답글 숨기기"
                                : `답글 보기(${comment.replies.length}개)`}
                        </span>
                    </button>
                )}

                {/* 대댓글 목록 */}
                {showReplies &&
                    comment.replies &&
                    comment.replies.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    onReply={onReply}
                                    postId={postId}
                                    onDeleted={onDeleted}
                                />
                            ))}
                        </div>
                    )}
            </div>

            {/* 신고/삭제 모달 */}
            <CommentActionsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                isOwner={isOwner}
                onDelete={handleDelete}
                onReport={() => {
                    setModalOpen(false);
                    setReportOpen(true);
                }}
            />

            <CommentReportModal
                isOpen={reportOpen}
                onClose={() => setReportOpen(false)}
                postId={postId}
                commentId={comment.id}
                onReported={() => {
                    setReportOpen(false);
                    setConfirmOpen(true);
                }}
            />

            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                userId={comment.userId}
            />
        </div>
    );
}
