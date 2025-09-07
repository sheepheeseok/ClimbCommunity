import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { timeAgo } from "@/utils/timeAgo";
import { LikeIcon, LikeIconFilled } from "@/components/icons/LikeIcon";
import { CommentIcon } from "@/components/icons/CommentIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { SaveIcon, SaveIconFilled } from "@/components/icons/SaveIcon";
import {CompletedProblemsCount} from "@/components/CompletedProblemsCount";
import CommentList from "@/components/comments/CommentList";

type PostCardProps = {
    post: any;
    onCommentClick?: (post: any) => void;
};

export default function PostCard({ post, onCommentClick }: PostCardProps) {
    const mediaList = [
        ...(post.imageUrls?.map((url: string) => ({ type: "image", url })) || []),
        ...(post.videoUrls?.map((url: string) => ({ type: "video", url })) || []),
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [likeActive, setLikeActive] = useState(false);
    const [saveActive, setSaveActive] = useState(false);


    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // ✅ currentIndex 변경될 때 현재 영상만 play, 나머지는 pause
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

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentIndex < mediaList.length - 1) setCurrentIndex((prev) => prev + 1);
    };

    // ✅ 더보기 처리
    const lines = post.content.split("\n");
    const firstLine = lines[0] ?? "";
    const secondLine = lines[1] ?? "";
    const secondLinePreview = secondLine.slice(0, 3);
    const hasMore = secondLine.length > 3 || lines.length > 2;

    return (
        <div
            className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-white font-semibold text-sm">
                        {post.userId[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center space-x-1">
                            <h3 className="font-semibold text-sm text-black">{post.userId}</h3>
                            <span className="text-xl font-bold text-gray-500">·</span>
                            <span className="text-sm text-gray-500">
                {post.createdAt ? timeAgo(post.createdAt) : ""}
              </span>
                        </div>
                        {post.location && (
                            <p className="text-sm text-black">{post.location}</p>
                        )}
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋯</button>
            </div>

            {/* Media 슬라이더 */}
            <div className="relative aspect-[4/5] bg-black overflow-hidden">
                <motion.div
                    className="flex w-full h-full"
                    animate={{x: `-${currentIndex * 100}%`}}
                    transition={{duration: 0.4, ease: "easeInOut"}}
                >
                    {mediaList.map((media, i) => (
                        <div key={i} className="w-full h-full flex-shrink-0 relative">
                            {media.type === "image" ? (
                                <img
                                    src={media.url}
                                    alt={`media-${i}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    ref={(el) => {
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
                                <ChevronLeft className="w-5 h-5 text-gray-800"/>
                            </button>
                        )}
                        {currentIndex < mediaList.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-800"/>
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
                        {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex space-x-5">
                    <button
                        onClick={() => setLikeActive(!likeActive)}
                        className="cursor-pointer"
                    ><span className="flex items-center text-gray-700 hover:text-gray-500">
                            {likeActive ? <LikeIconFilled className="w-6 h-6 animate-pop"/> :
                                <LikeIcon className="w-6 h-6 animate-pop"/>}
                    </span>
                    </button>
                    <button onClick={() => onCommentClick && onCommentClick(post)}
                            className="flex items-center text-gray-700 hover:text-gray-500">
                        <CommentIcon className="w-6 h-6"/>
                    </button>
                    <button className="flex items-center text-gray-700 hover:text-gray-500">
                        <ShareIcon className="w-6 h-6"/>
                    </button>
                </div>
                <button onClick={() => setSaveActive(!saveActive)}
                        className="flex items-center text-gray-700 hover:text-gray-500">
                    {saveActive ? <SaveIconFilled className="w-6 h-6 animate-pop"/> :
                        <SaveIcon className="w-6 h-6 animate-pop"/>}
                </button>
            </div>

            {post.completedProblems && (
                <div className="px-4 pb-2">
                    <CompletedProblemsCount problems={post.completedProblems}/>
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

            {/* ✅ 댓글 입력창 (구분선 추가) */}
            <div className="px-4 py-2 border-t border-gray-200 mt-1">
                <input
                    type="text"
                    placeholder="댓글 달기..."
                    className="w-full text-sm text-black py-2 focus:outline-none"
                />
            </div>
        </div>
    );
}
