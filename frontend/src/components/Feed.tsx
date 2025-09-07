import { useEffect, useState } from "react";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import { PostDetailModal } from "@/modals/PostDetailModal"; // 모달 임포트

export default function Feed() {
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<any | null>(null); // ✅ 선택된 게시물

    useEffect(() => {
        fetchPosts().then((data) => {
            setPosts(data); // ✅ content 배열만 넘어옴
        });
    }, []);

    return (
        <main className="py-6 space-y-6">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onCommentClick={() => setSelectedPost(post)} // ✅ 댓글 버튼 → 모달 열기
                />
            ))}

            {/* ✅ 상세보기 모달 */}
            <PostDetailModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                post={selectedPost}
            />
        </main>
    );
}
