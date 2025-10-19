import { useEffect, useState } from "react";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import { PostDetailModal } from "@/modals/PostDetailModal";
import {feedService} from "@/services/feedService"; // 모달 임포트

export default function Feed() {
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<any | null>(null); // ✅ 선택된 게시물

    useEffect(() => {
        const loadFeed = async () => {
            try {
                const data = await feedService.getFeed();
                console.log("📡 feedService 응답:", data); // ✅ 추가 — 백엔드 응답 구조 확인

                // ✅ content만 꺼내기
                const postsArray = Array.isArray(data) ? data : data.content;
                console.log("🧱 변환된 postsArray:", postsArray); // ✅ 추가 — 실제 전달 배열 확인

                setPosts(postsArray || []);
            } catch (err) {
                console.error("❌ 피드 불러오기 실패:", err);
            }
        };
        loadFeed();
    }, []);

    useEffect(() => {
        if (posts.length > 0) {
            console.log("🧩 Feed posts 구조:", posts[0]);
        }
    }, [posts]);

    return (
        <main className="py-6 space-y-6">
            {posts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    아직 게시물이 없습니다.
                </div>
            )}

            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onCommentClick={() => setSelectedPost(post)}
                />
            ))}

            <PostDetailModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                post={selectedPost}
            />
        </main>
    );
}
