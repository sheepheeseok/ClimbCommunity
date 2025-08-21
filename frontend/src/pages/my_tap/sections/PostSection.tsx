import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UnderlineTabs, UnderlineTabsContent } from "@/components/UnderlineTabs";
import RecordThumbnail from "@/pages/my_tap/components/RecordThumbnail";
import PostModalShell from "@/pages/my_tap/components/PostModalShell";
import { usePostModal } from "@/pages/my_tap/hooks/usePostModal";
import PostModal from "../components/PostModal";
import EmptyPosts from "@/pages/my_tap/components/EmptyPosts";
import type { Post } from "@/types/post";

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
                  author={current.author ?? {       // author가 없다면 안전 기본값
                     id: "unknown",
                     nickname: "알 수 없음",
                     avatarUrl: undefined,
                     level: undefined,
                  }}
                  currentUserId={null}              
                  isFollowing={false}
                  onToggleFollow={() => { }}
               />
            ) : null}
         </PostModalShell>
      </>
   );
}