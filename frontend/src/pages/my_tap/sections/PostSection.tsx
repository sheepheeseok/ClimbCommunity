import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UnderlineTabs, UnderlineTabsContent } from "@/components/UnderlineTabs";
import RecordThumbnail from "@/pages/my_tap/components/RecordThumbnail";
import PostModalShell from "@/pages/my_tap/components/PostModalShell";
import { usePostModal } from "@/pages/my_tap/hooks/usePostModal";
import PostModal from "../components/PostModal";
import EmptyPosts from "@/pages/my_tap/components/EmptyPosts";
import type { Post } from "@/types/post";
import { PostComment } from "@/types/comment";

// 댓글 가데이터
const commentsByPostId: Record<string, PostComment[]> = {
   p1: [
      { id: "c1", author: { id: "u9", nickname: "민수", level: "Lv.4" }, createdAt: "2025-08-10T09:15:00Z", content: "동작 리듬 👍" },
      { id: "c2", author: { id: "u8", nickname: "소정" }, createdAt: "2025-08-10T10:02:00+09:00", content: "라스트 발 위치 팁 궁금!" },
   ],
   p2: [
      { id: "c3", author: { id: "u5", nickname: "지우" }, createdAt: "2025-08-11T11:00:00+09:00", content: "템포 유지 꿀팁 고마워요 🙌" },
   ],
   p3: [], // 댓글 없음 케이스
}

const asLen7 = (arr?: number[]) => {
   const base = Array(7).fill(0)
   if (!arr) return base
   for (let i = 0; i < 7; i++) base[i] = Number(arr[i] ?? 0)
   return base
}

export default function PostsSection({
   tab, onTabChange, posts,
}: {
   tab: "posts" | "tab2";
   posts: Post[];
   onTabChange: (v: "posts" | "tab2") => void;
}) {
   const { isOpen, selectedId, index, open, close, goPrev, goNext } = usePostModal(posts);
   const current = index >= 0 ? posts[index] : null;
   const hasPosts = posts.length > 0;

   useEffect(() => {
      if (!isOpen) return;
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") close();
         if (e.key === "ArrowLeft") goPrev();
         if (e.key === "ArrowRight") goNext();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [isOpen, close, goPrev, goNext]);

   return (
      <>
         <UnderlineTabs
            items={[{ value: "posts", label: "운동 기록" }, { value: "tab2", label: "탭2" }]}
            value={tab}
            onValueChange={(v) => onTabChange(v as any)}
            layoutId="underline-main"
            className="w-full"
         >
            <UnderlineTabsContent value="posts">
               <Card className="border-none p-0">
                  <CardContent className="p-0 md:p-3">
                     {hasPosts ? (
                        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                           {posts.map((p) => (
                              <RecordThumbnail
                                 key={p.id}
                                 id={p.id}
                                 media={p.media}
                                 createdAt={p.createdAt}
                                 location={p.location}
                                 onClick={open}
                              />
                           ))}
                        </div>
                     ) : (
                        <EmptyPosts />
                     )}
                  </CardContent>
               </Card>
            </UnderlineTabsContent>

            <UnderlineTabsContent value="tab2">
               <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">
                  아직 정해지지 않은 영역입니다.
               </CardContent></Card>
            </UnderlineTabsContent>
         </UnderlineTabs>




         {/* ✅ 모달 쉘 + 내부 PostModal 렌더 */}
         <PostModalShell
            open={isOpen}
            onOpenChange={(v) => !v && close()}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={index > 0}
            hasNext={index >= 0 && index < posts.length - 1}
         >
            {current ? (
               <PostModal
                  key={selectedId!}                 // 포스트 이동 시 내부 상태 초기화
                  postId={current.id}
                  media={current.media}             // 단일 media 배열
                  author={current.author}
                  text={current.text}
                  attemptsByGrade={asLen7(current.attemptsByGrade)}
                  clearsByGrade={asLen7(current.clearsByGrade)}
                  createdAt={current.createdAt}
                  location={current.location}
                  comments={commentsByPostId[current.id] ?? []}
               />
            ) : null}
         </PostModalShell>
      </>
   );
}