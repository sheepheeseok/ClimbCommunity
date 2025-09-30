import { useEffect, useRef, useState } from "react";
import { timeAgo } from "@/utils/timeAgo";
import type { Comment } from "./types";
import { MoreHorizontal } from "lucide-react";
import { CommentOptionsModal } from "@/modals/CommentOptionsModal";

type Props = {
    comment: Comment;
    onReply: (comment: Comment) => void;
    postId: number;
    onDeleted: () => void;
    highlightCommentId?: number | null;
};

export default function CommentItem({
                                        comment,
                                        onReply,
                                        postId,
                                        onDeleted,
                                        highlightCommentId,
                                    }: Props) {
    const [showReplies, setShowReplies] = useState(false);

    // ✅ 모달 상태
    const [modalOpen, setModalOpen] = useState(false);
    const [targetComment, setTargetComment] = useState<Comment | null>(null);

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!highlightCommentId) return;

        // ✅ 현재 댓글 혹은 대댓글 포함 여부 판별
        const isTargetInReplies =
            comment.replies?.some(
                (r) =>
                    r.id === highlightCommentId ||
                    r.replies?.some((rr) => rr.id === highlightCommentId)
            ) ?? false;

        // 대댓글이면 자동으로 펼침
        if (isTargetInReplies) {
            setShowReplies(true);
        }

        // DOM 업데이트 후 스크롤 & 하이라이트
        const timer = setTimeout(() => {
            const el = document.getElementById(`comment-${highlightCommentId}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.classList.add("transition-colors", "duration-700", "bg-blue-300/40");
                setTimeout(() => {
                    el.classList.remove("bg-blue-300/40");
                }, 2000);
            }
        }, 150); // DOM 렌더링 대기

        return () => clearTimeout(timer);
    }, [highlightCommentId, comment.replies]);

    // ✅ 대댓글 평탄화
    const flattenReplies = (replies: Comment[], parentUserId: string): React.ReactNode[] => {
        let result: React.ReactNode[] = [];

        for (const reply of replies) {
            result.push(
                <div
                    key={reply.id}
                    id={`comment-${reply.id}`}
                    className={`flex items-start space-x-2 mt-2 group/reply ${
                        highlightCommentId === reply.id ? "bg-blue-300/40" : ""
                    }`}
                >
                    <img
                        src={reply.profileImage || "/default-avatar.png"}
                        alt={reply.userId}
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                        <div>
                            <span className="font-semibold text-sm text-black mr-1">{reply.userId}</span>
                            <span className="text-blue-600 text-sm mr-1">@{parentUserId}</span>
                            <span className="text-gray-800 text-sm">{reply.content}</span>
                        </div>

                        {/* ✅ 메타 + ... 버튼 */}
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                            <span>{timeAgo(reply.createdAt)}</span>
                            {reply.likeCount > 0 && <span>좋아요 {reply.likeCount}개</span>}
                            <button className="font-medium" onClick={() => onReply(reply)}>
                                답글 달기
                            </button>
                            {/* ... 버튼 → 답글 달기 오른쪽 */}
                            <button
                                onClick={() => {
                                    setTargetComment(reply);
                                    setModalOpen(true);
                                }}
                                className="ml-1 p-1 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                            >
                                <MoreHorizontal size={14} className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            );

            if (reply.replies && reply.replies.length > 0) {
                result = result.concat(flattenReplies(reply.replies, reply.userId));
            }
        }

        return result;
    };

    return (
        <div
            id={`comment-${comment.id}`}
            className={`flex items-start space-x-3 group/comment ${
                highlightCommentId === comment.id ? "bg-blue-300/40" : ""
            }`}
        >
            {/* 프로필 */}
            <img
                src={comment.profileImage || "/default-avatar.png"}
                alt={comment.userId}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />

            {/* 본문 */}
            <div className="flex-1">
                <div>
                    <span className="font-semibold text-sm text-black mr-1">{comment.userId}</span>
                    <span className="text-gray-800 text-[15px]">{comment.content}</span>
                </div>

                {/* ✅ 메타 + ... 버튼 */}
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                    <span>{timeAgo(comment.createdAt)}</span>
                    {comment.likeCount > 0 && <span>좋아요 {comment.likeCount}개</span>}
                    <button className="font-medium" onClick={() => onReply(comment)}>
                        답글 달기
                    </button>
                    {/* ... 버튼 → 답글 달기 오른쪽 */}
                    <button
                        onClick={() => {
                            setTargetComment(comment);
                            setModalOpen(true);
                        }}
                        className="ml-1 p-1 opacity-0 group-hover/comment:opacity-100 transition-opacity"
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
                        <span>{showReplies ? "답글 숨기기" : `답글 보기(${comment.replies.length}개)`}</span>
                    </button>
                )}

                {/* 대댓글 */}
                {showReplies && comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-6 space-y-2">
                        {flattenReplies(comment.replies, comment.userId)}
                    </div>
                )}
            </div>

            {/* ✅ 공통 옵션 모달 */}
            {targetComment && (
                <CommentOptionsModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    isOwner={currentUser?.userId === targetComment.userId}
                    postId={postId}
                    commentId={targetComment.id}
                    onDeleted={onDeleted}
                />
            )}
        </div>
    );
}
