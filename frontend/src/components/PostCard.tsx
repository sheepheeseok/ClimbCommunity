import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { timeAgo } from "@/utils/timeAgo";
import { LikeIcon, LikeIconFilled } from "@/components/icons/LikeIcon";
import { CommentIcon } from "@/components/icons/CommentIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { SaveIcon, SaveIconFilled } from "@/components/icons/SaveIcon";
import { CompletedProblemsCount } from "@/components/CompletedProblemsCount";
import { followService } from "@/services/followService";
import { useAuth } from "@/hooks/useAuth";
import { LikeService } from "@/services/LikeService";
import { PostOptionsModal } from "@/modals/PostOptionsModal";
import api from "@/lib/axios";
import { useProfileNavigation } from "@/hooks/useProfileNavigation";
import { useSave } from "@/hooks/useSave";

type Media = {
    type: "image" | "video";
    url: string;
    orderIndex: number;
};

type PostCardProps = {
    post: {
        id: number;
        content: string;
        userId: string;
        username: string;
        profileImage?: string;
        createdAt: string;
        location?: string;
        commentCount: number;
        completedProblems?: Record<string, number>;
        mediaList: Media[];
        likeCount?: number;
    };
    onCommentClick?: (post: any) => void;
};

export default function PostCard({ post, onCommentClick }: PostCardProps) {
    const { userId: currentUserId } = useAuth();
    const mediaList: Media[] = post.mediaList || [];
    const { goToProfile } = useProfileNavigation();

    const { saved, toggleSave, loading } = useSave(post.id);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [likeActive, setLikeActive] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(post.likeCount ?? 0);
    const [followStatus, setFollowStatus] = useState<"NONE" | "PENDING" | "ACCEPTED">("NONE");

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [showOptions, setShowOptions] = useState(false);

    // ✅ 현재 인덱스 영상만 play
    useEffect(() => {
        videoRefs.current.forEach((video, i) => {
            if (video) {
                if (i === currentIndex) {
                    video.muted = isMuted;
                    video.play().catch(() => {});
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    }, [currentIndex, isMuted]);

    const handlePrev = () => currentIndex > 0 && setCurrentIndex((prev) => prev - 1);
    const handleNext = () =>
        currentIndex < mediaList.length - 1 && setCurrentIndex((prev) => prev + 1);

    // ✅ 초기 Follow 상태 조회
    useEffect(() => {
        if (post.userId !== currentUserId && followStatus === "NONE") {
            followService
                .getFollowStatus(post.userId)
                .then(setFollowStatus)
                .catch(() => setFollowStatus("NONE"));
        }
    }, [post.userId, currentUserId, followStatus]);

    // ✅ 좋아요 여부/갯수 불러오기
    useEffect(() => {
        LikeService.hasUserLiked(post.id).then(setLikeActive);
        LikeService.getLikeCount(post.id).then(setLikeCount);
    }, [post.id]);

    // ✅ 좋아요 토글
    const handleLike = async () => {
        try {
            const message = await LikeService.toggleLike(post.id);
            if (message.includes("추가")) {
                setLikeActive(true);
                setLikeCount((c) => c + 1);
            } else {
                setLikeActive(false);
                setLikeCount((c) => c - 1);
            }
        } catch (e) {
            console.error("좋아요 실패:", e);
        }
    };

    // ✅ 팔로우/언팔/취소 토글
    const handleFollowToggle = async () => {
        try {
            if (followStatus === "ACCEPTED") {
                await followService.unfollow(post.userId);
                setFollowStatus("NONE");
            } else if (followStatus === "PENDING") {
                await followService.cancelRequest(post.userId);
                setFollowStatus("NONE");
            } else {
                // follow -> 서버에서 상태 조회까지 확정
                await followService.follow(post.userId);
                const newStatus = await followService.getFollowStatus(post.userId);
                setFollowStatus(newStatus); // 서버 기준으로 확정
            }
        } catch (e) {
            console.error("팔로우 상태 변경 실패:", e);
        }
    };


    // ✅ 게시글 삭제
    const handleDelete = async () => {
        try {
            await api.delete(`/api/posts/${post.id}`);
            alert("게시글이 삭제되었습니다.");
            setShowOptions(false);
            window.location.reload(); // 간단하게 새로고침
        } catch (e) {
            console.error(e);
            alert("게시글 삭제 실패");
        }
    };

    // ✅ 본문 더보기 처리
    const lines = post.content.split("\n");
    const firstLine = lines[0] ?? "";
    const secondLine = lines[1] ?? "";
    const secondLinePreview = secondLine.slice(0, 3);
    const hasMore = secondLine.length > 3 || lines.length > 2;

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                {/* 왼쪽: 아바타 + 유저 정보 */}
                <div className="flex items-center space-x-3">
                    <img
                        src={post.profileImage || "/default-avatar.png"}
                        alt={post.username}
                        className="w-10 h-10 cursor-pointer rounded-full object-cover border border-gray-200"
                        onClick={(e) => goToProfile(e, post.userId)}
                    />
                    <div>
                        <div className="flex items-center space-x-1">
                            <h3
                                onClick={(e) => goToProfile(e, post.userId)}
                                className="font-semibold cursor-pointer text-sm text-black"
                            >
                                {post.username}
                            </h3>
                            <span className="text-xl font-bold text-gray-500">·</span>
                            <span className="text-sm text-gray-500">
                                {post.createdAt ? timeAgo(post.createdAt) : ""}
                            </span>
                        </div>
                        {post.location && <p className="text-sm text-black">{post.location}</p>}
                    </div>
                </div>

                {/* 오른쪽: 팔로우 버튼 + 옵션 */}
                <div className="flex items-center space-x-4">
                    {currentUserId && post.userId !== currentUserId && (
                        followStatus === "ACCEPTED" ? (
                            <button
                                onClick={handleFollowToggle}
                                className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded hover:bg-gray-300 transition"
                            >
                                팔로잉
                            </button>
                        ) : followStatus === "PENDING" ? (
                            <button
                                onClick={handleFollowToggle}
                                className="px-3 py-1 bg-gray-300 text-gray-600 text-xs font-medium rounded hover:bg-gray-400 transition"
                            >
                                요청중
                            </button>
                        ) : (
                            <button
                                onClick={handleFollowToggle}
                                className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition"
                            >
                                팔로우
                            </button>
                        )
                    )}
                    <button
                        onClick={() => setShowOptions(true)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ⋯
                    </button>
                </div>
            </div>

            {/* Media 슬라이더 */}
            <div className="relative aspect-[4/5] bg-black overflow-hidden">
                <motion.div
                    className="flex w-full h-full"
                    animate={{ x: `-${currentIndex * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {mediaList.map((media, i) => (
                        <div key={i} className="w-full h-full flex-shrink-0 relative">
                            {media.type === "image" ? (
                                <img src={media.url} alt={`media-${i}`} className="w-full h-full object-cover" />
                            ) : (
                                <video
                                    ref={(el: HTMLVideoElement | null) => {
                                        videoRefs.current[i] = el;
                                    }}
                                    src={media.url}
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* 좌우 버튼 */}
                {mediaList.length > 1 && (
                    <>
                        {currentIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>
                        )}
                        {currentIndex < mediaList.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                        )}
                    </>
                )}

                {/* 인디케이터 */}
                {mediaList.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                        {mediaList.map((_, i) => (
                            <span
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                    i === currentIndex ? "bg-white" : "bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* 음소거 버튼 */}
                {mediaList[currentIndex]?.type === "video" && (
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex space-x-5">
                    <button onClick={handleLike} className="cursor-pointer">
                        <span className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-500">
                            {likeActive ? (
                                <LikeIconFilled className="w-6 h-6 animate-pop" />
                            ) : (
                                <LikeIcon className="w-6 h-6 animate-pop" />
                            )}
                            {likeCount}
                        </span>
                    </button>

                    <button
                        onClick={() => onCommentClick && onCommentClick(post)}
                        className="flex items-center text-gray-700 hover:text-gray-500"
                    >
                        <CommentIcon className="w-6 h-6" />
                    </button>
                    <button className="flex items-center text-gray-700 hover:text-gray-500">
                        <ShareIcon className="w-6 h-6" />
                    </button>
                </div>
                <button
                    onClick={toggleSave}
                    disabled={loading}
                    className="flex items-center text-gray-700 hover:text-gray-500"
                >
                    {saved ? (
                        <SaveIconFilled className="w-6 h-6 animate-pop" />
                    ) : (
                        <SaveIcon className="w-6 h-6 animate-pop" />
                    )}
                </button>
            </div>

            {post.completedProblems && (
                <div className="px-4 pb-2">
                    <CompletedProblemsCount problems={post.completedProblems} />
                </div>
            )}

            {/* Content */}
            <div className="px-4 pb-2 text-black text-sm py-1">
                <span className="font-semibold mr-2">{post.userId}</span>
                {expanded ? (
                    <span className="whitespace-pre-line">{post.content}</span>
                ) : (
                    <span className="whitespace-pre-line">
                        {firstLine}
                        {secondLine && `\n${secondLinePreview}`}
                        {hasMore && (
                            <>
                                ...{" "}
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="text-gray-500 text-sm"
                                >
                                    더 보기
                                </button>
                            </>
                        )}
                    </span>
                )}
            </div>

            {post.commentCount > 0 && (
                <div className="px-4 pb-2">
                    <button
                        onClick={() => onCommentClick && onCommentClick(post)}
                        className="text-sm text-gray-500"
                    >
                        댓글 {post.commentCount}개 모두 보기
                    </button>
                </div>
            )}

            {/* 댓글 입력창 */}
            <div className="px-4 py-2 border-t border-gray-200 mt-1">
                <input
                    type="text"
                    placeholder="댓글 달기..."
                    className="w-full text-sm text-black py-2 focus:outline-none"
                />
            </div>

            <PostOptionsModal
                isOpen={showOptions}
                onClose={() => setShowOptions(false)}
                onDelete={handleDelete}
                onReport={() => alert("신고하기 기능 연동 예정")}
                isOwner={post.userId === currentUserId}
            />
        </div>
    );
}
