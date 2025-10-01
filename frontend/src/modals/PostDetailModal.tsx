import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronLeft,
    ChevronRight,
    Volume2,
    VolumeX,
    MoreHorizontal,
} from "lucide-react";

import { timeAgo } from "@/utils/timeAgo";
import { CommentIcon } from "@/components/icons/CommentIcon";
import { LikeIcon, LikeIconFilled } from "@/components/icons/LikeIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { SaveIcon, SaveIconFilled } from "@/components/icons/SaveIcon";
import CommentList from "@/components/comments/CommentList";
import type { Comment } from "@/components/comments/types";
import { followService } from "@/services/followService";
import { LikeService } from "@/services/LikeService";
import { useAuth } from "@/hooks/useAuth";
import { useFollowEvents, FollowEvent } from "@/hooks/useFollowEvents";
import api from "@/lib/axios";
import { PostOptionsModal } from "@/modals/PostOptionsModal";

interface Media {
    url: string;
    type: "image" | "video";
    orderIndex: number;
}

interface Post {
    id: number;
    content: string;
    username: string;
    userId: string;
    profileImage: string;
    location: string;
    mediaList: Media[];
    thumbnailUrl: string;
    createdAt: string;
    likeCount?: number;
}

interface PostDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    highlightCommentId?: number | null;
}

// ✅ Follow 상태 타입 & 정규화 함수
type FollowStatus = "NONE" | "PENDING" | "ACCEPTED";
function normalizeFollowStatus(status: string): FollowStatus {
    switch (status) {
        case "PENDING":
            return "PENDING";
        case "ACCEPTED":
            return "ACCEPTED";
        default: // NONE, REJECTED, UNFOLLOW
            return "NONE";
    }
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
                                                                    isOpen,
                                                                    onClose,
                                                                    post,
                                                                    highlightCommentId,
                                                                }) => {
    const { userId: currentUserId } = useAuth();

    if (!isOpen || !post) {
        return null;
    }

    // ✅ State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likeActive, setLikeActive] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(post?.likeCount ?? 0);
    const [saveActive, setSaveActive] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ 팔로우 상태 ("NONE" | "PENDING" | "ACCEPTED")
    const [followStatus, setFollowStatus] = useState<FollowStatus>("NONE");

    const [showOptions, setShowOptions] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // ✅ WebSocket 이벤트 수신 (팔로우 실시간 동기화)
    useFollowEvents({
        userId: post.userId,
        onFollowEvent: (event: FollowEvent) => {
            if (event.followerId === currentUserId) {
                setFollowStatus(normalizeFollowStatus(event.status));
            }
        },
    });

    // ✅ 모달 열림/닫힘 시 초기화
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";

            setCurrentIndex(0);
            videoRefs.current = [];

            if (post) {
                setLikeCount(post.likeCount ?? 0);
                LikeService.hasUserLiked(post.id).then(setLikeActive);
                LikeService.getLikeCount(post.id).then(setLikeCount);

                if (post.userId !== currentUserId) {
                    followService
                        .getFollowStatus(post.userId)
                        .then((status) => setFollowStatus(normalizeFollowStatus(status)))
                        .catch(() => setFollowStatus("NONE"));
                }
            }
        } else {
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "auto";

            if (top) {
                const scrollY = parseInt(top || "0") * -1;
                window.scrollTo(0, scrollY);
            }

            videoRefs.current = [];
            setReplyTo(null);
            setNewComment("");
        }

        return () => {
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "auto";

            if (top) {
                const scrollY = parseInt(top || "0") * -1;
                window.scrollTo(0, scrollY);
            }
            videoRefs.current = [];
        };
    }, [isOpen, post, currentUserId]);

    // ✅ 영상 자동재생 제어
    useEffect(() => {
        videoRefs.current.forEach((video, i) => {
            if (!video) return;
            if (i === currentIndex) {
                video.muted = isMuted;
                video.play().catch(() => {});
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [currentIndex, isMuted]);

    if (!isOpen || !post) return null;

    // ✅ 댓글 전송
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/api/posts/${post.id}/comments`, {
                content: newComment,
                parentCommentId: replyTo?.id || null,
            });
            setRefreshKey((prev) => prev + 1);
            setNewComment("");
            setReplyTo(null);
        } catch (err) {
            console.error("댓글 등록 실패:", err);
        }
    };

    // ✅ 좋아요 토글
    const handleLike = async () => {
        try {
            const message = await LikeService.toggleLike(post.id);
            if (message.includes("추가")) {
                setLikeActive(true);
                setLikeCount((c) => c + 1);
            } else {
                setLikeActive(false);
                setLikeCount((c) => Math.max(c - 1, 0));
            }
        } catch (e) {
            console.error("좋아요 실패:", e);
        }
    };

    // ✅ 팔로우/언팔로우
    const handleFollow = async () => {
        try {
            await followService.follow(post.userId);
            const status = await followService.getFollowStatus(post.userId);
            setFollowStatus(normalizeFollowStatus(status));
        } catch (e) {
            console.error("팔로우 실패:", e);
        }
    };

    const handleUnfollow = async () => {
        try {
            await followService.unfollow(post.userId);
            setFollowStatus("NONE");
        } catch (e) {
            console.error("언팔로우 실패:", e);
        }
    };

    const handleCancelRequest = async () => {
        try {
            await followService.cancelRequest(post.userId);
            setFollowStatus("NONE");
        } catch (e) {
            console.error("팔로우 요청 취소 실패:", e);
        }
    };

    const handleReply = (comment: Comment) => {
        setReplyTo(comment);
        inputRef.current?.focus();
    };

    const handleCommentIconClick = () => {
        inputRef.current?.focus();
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/posts/${post.id}`);
            alert("게시글이 삭제되었습니다.");
            setShowOptions(false);
            onClose(); // 모달 닫기
        } catch (e) {
            console.error("게시글 삭제 실패:", e);
            alert("게시글 삭제에 실패했습니다.");
        }
    };

    // ✅ 신고 핸들러
    const handleReport = () => {
        alert("신고 기능은 추후 연동 예정입니다.");
        setShowOptions(false);
    };

    const mediaList = post.mediaList || [];

    // ==================== UI ====================
    const overlay = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-60 z-[500] flex items-center justify-center"
                onClick={onClose}
            >
                {/* Close 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-5 z-[10000] hover:bg-opacity-70 p-2 text-white"
                >
                    <X size={28} />
                </button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="
            bg-white rounded-2xl shadow-2xl
            w-full h-full max-w-full max-h-full
            sm:max-w-3xl sm:h-auto
            lg:max-w-5xl lg:h-[90vh]
            flex flex-col lg:flex-row
            overflow-hidden
          "
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Left: Media */}
                    <div className="lg:w-3/5 relative bg-black flex items-center justify-center overflow-hidden">
                        <motion.div
                            className="flex w-full h-full"
                            animate={{ x: `-${currentIndex * 100}%` }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            {mediaList.map((media, i) => (
                                <div
                                    key={i}
                                    className="w-full h-full flex-shrink-0 flex items-center justify-center bg-black"
                                >
                                    {media.type === "image" ? (
                                        <img
                                            src={media.url}
                                            alt={`Post Media ${i + 1}`}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <video
                                                ref={(el) => {
                                                    videoRefs.current[i] = el;
                                                }}
                                                src={media.url}
                                                loop
                                                muted={isMuted}
                                                autoPlay={i === currentIndex}
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                            {i === currentIndex && (
                                                <button
                                                    onClick={() => setIsMuted(!isMuted)}
                                                    className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-2 rounded-full text-white"
                                                >
                                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                        {/* 좌우 버튼 */}
                        {mediaList.length > 1 && (
                            <>
                                {currentIndex > 0 && (
                                    <button
                                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2
                      bg-white/70 hover:bg-white w-8 h-8
                      rounded-full flex items-center justify-center shadow"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                                    </button>
                                )}
                                {currentIndex < mediaList.length - 1 && (
                                    <button
                                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2
                      bg-white/70 hover:bg-white w-8 h-8
                      rounded-full flex items-center justify-center shadow"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-800" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="lg:w-2/5 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center space-x-2">
                                <img
                                    src={post.profileImage || "/default-avatar.png"}
                                    alt={post.username}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                />
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold text-sm text-black">
                                            {post.userId}
                                        </h3>
                                        {currentUserId &&
                                            post.userId !== currentUserId &&
                                            (followStatus === "ACCEPTED" ? (
                                                <button
                                                    onClick={handleUnfollow}
                                                    className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                >
                                                    팔로잉
                                                </button>
                                            ) : followStatus === "PENDING" ? (
                                                <button
                                                    onClick={handleCancelRequest}
                                                    className="text-xs px-2 py-1 rounded bg-gray-300 text-gray-600 hover:bg-gray-400"
                                                >
                                                    요청중
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleFollow}
                                                    className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    팔로우
                                                </button>
                                            ))}
                                    </div>
                                    {post.location && (
                                        <p className="text-sm text-black">{post.location}</p>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => setShowOptions(true)} className="p-2 hover:bg-gray-100 rounded-full">
                                <MoreHorizontal className="text-gray-600" />
                            </button>
                        </div>

                        {/* Content + 댓글 */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* 본문 */}
                            <div className="flex items-start space-x-2">
                                <img
                                    src={post.profileImage || "/default-avatar.png"}
                                    alt={post.username}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                />
                                <div>
                  <span className="font-semibold text-sm text-black mr-1">
                    {post.userId}
                  </span>
                                    <span className="text-gray-800 text-[15px] whitespace-pre-line">
                    {post.content}
                  </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {post.createdAt ? timeAgo(post.createdAt) : ""}
                                    </p>
                                </div>
                            </div>

                            <CommentList
                                postId={post.id}
                                onReply={handleReply}
                                refreshKey={refreshKey}
                                onDeleted={() => setRefreshKey((k) => k + 1)}
                                highlightCommentId={highlightCommentId ?? undefined}
                            />
                        </div>

                        {/* Actions + 입력창 */}
                        <div className="border-t">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex space-x-4">
                                        {/* 좋아요 + 개수 */}
                                        <button onClick={handleLike} className="cursor-pointer">
                      <span className="flex items-center gap-2 text-gray-700 hover:text-gray-500">
                        {likeActive ? (
                            <LikeIconFilled className="w-6 h-6 animate-pop" />
                        ) : (
                            <LikeIcon className="w-6 h-6 animate-pop" />
                        )}
                          {likeCount}
                      </span>
                                        </button>
                                        <button
                                            onClick={handleCommentIconClick}
                                            className="flex items-center text-gray-700 hover:text-gray-500"
                                        >
                                            <CommentIcon className="w-6 h-6" />
                                        </button>
                                        <button className="flex items-center text-gray-700 hover:text-gray-500">
                                            <ShareIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setSaveActive(!saveActive)}
                                        className="flex items-center text-gray-700 hover:text-gray-500"
                                    >
                                        {saveActive ? (
                                            <SaveIconFilled className="w-6 h-6 animate-pop" />
                                        ) : (
                                            <SaveIcon className="w-6 h-6 animate-pop" />
                                        )}
                                    </button>
                                </div>

                                {/* 작성 시간 */}
                                <p className="text-xs text-gray-500 mt-1">
                                    {post.createdAt ? timeAgo(post.createdAt) : ""}
                                </p>

                                {/* 답글 대상 */}
                                {replyTo && (
                                    <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between mt-1">
                    <span className="text-sm text-blue-700 font-medium">
                      @{replyTo.userId} 님에게 답글 작성 중
                    </span>
                                        <button
                                            onClick={() => setReplyTo(null)}
                                            className="ml-3 text-gray-400 text-xs hover:text-gray-600"
                                        >
                                            ✕ 취소
                                        </button>
                                    </div>
                                )}

                                {/* 댓글 입력창 */}
                                <form onSubmit={handleSubmitComment} className="relative mt-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="댓글 달기..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full pr-12 border-0 text-black outline-none text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className={`absolute right-0 top-1/2 -translate-y-1/2 font-semibold text-sm 
                      ${
                                            newComment.trim() ? "text-blue-500" : "text-blue-300"
                                        }`}
                                    >
                                        게시
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            <PostOptionsModal
                isOpen={showOptions}
                onClose={() => setShowOptions(false)}
                onDelete={handleDelete}
                onReport={handleReport}
                isOwner={post.userId === currentUserId}
            />
        </AnimatePresence>
    );

    return ReactDOM.createPortal(overlay, document.body);
};
