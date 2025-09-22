import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Comment } from "./types";
import CommentItem from "./CommentItem";

type Props = {
    postId: number;
    onReply: (comment: Comment) => void;
    refreshKey: number;
    onDeleted: () => void;
    highlightCommentId?: number | null;
};

export default function CommentList({ postId, onReply, refreshKey, onDeleted, highlightCommentId }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/api/posts/${postId}/comments`, {
                    params: { page: 0, size: 10 },
                });
                setComments(res.data.content || []);
            } catch (err) {
                console.error("댓글 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, refreshKey]);

    if (loading) return <p className="text-sm text-gray-500 px-4">불러오는 중...</p>;

    return (
        <div className="space-y-4 pb-4">
            {comments.length > 0 ? (
                comments.map((c) => (
                    <div key={c.id} id={`comment-${c.id}`}>
                        <CommentItem
                            key={c.id}
                            comment={c}
                            onReply={onReply}
                            postId={postId}
                            onDeleted={onDeleted}
                            highlightCommentId={highlightCommentId}
                        />
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">댓글이 없습니다.</p>
            )}
        </div>
    );
}
