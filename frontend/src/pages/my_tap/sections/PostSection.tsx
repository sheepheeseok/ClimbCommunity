import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UnderlineTabs, UnderlineTabsContent } from "@/components/UnderlineTabs";
import RecordThumbnail from "@/pages/my_tap/components/RecordThumbnail";
import PostModalShell from "@/pages/my_tap/components/PostModalShell";
import { usePostModal } from "@/pages/my_tap/hooks/usePostModal";
import PostModal from "../components/PostModal";
import EmptyPosts from "@/pages/my_tap/components/EmptyPosts";
import { useMyPageData } from "../data/useMyPageData";

// 숫자배열 7칸 보정
const asLen7 = (arr?: number[]) => {
   const base = Array(7).fill(0);
   if (!arr) return base;
   for (let i = 0; i < 7; i++) base[i] = Number(arr[i] ?? 0);
   return base;
};

export default function PostsSection() {
   const { data, ready } = useMyPageData();

   // UI 상태 훅들
   const [tab, setTab] = useState<"posts" | "tab2">("posts");

   // 시드/데이터
   const posts = data.posts; // ready=false여도 [] 보장
   const commentsByPostId = data.commentsByPostId;
   const hasPosts = posts.length > 0;

   // 모달 훅 (항상 호출)
   const { isOpen, selectedId, index, open, close, goPrev, goNext } = usePostModal(posts);
   const current = index >= 0 ? posts[index] : null;

   // 키보드 단축키
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
            onValueChange={(v) => setTab(v as "posts" | "tab2")}
            layoutId="underline-main"
            className="w-full"
         >
            <UnderlineTabsContent value="posts">
               <Card className="border-none p-0">
                  <CardContent className="p-0 md:p-3">
                     {!ready ? (
                        // 로딩 스켈레톤
                        <div className="p-4">
                           <div className="h-40 rounded-lg bg-muted animate-pulse" />
                        </div>
                     ) : hasPosts ? (
                        // 실제 목록
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
                        // 빈 상태
                        <EmptyPosts />
                     )}
                  </CardContent>
               </Card>
            </UnderlineTabsContent>

            <UnderlineTabsContent value="tab2">
               <Card>
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                     아직 정해지지 않은 영역입니다.
                  </CardContent>
               </Card>
            </UnderlineTabsContent>
         </UnderlineTabs>

         {/* 모달 */}
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
                  key={selectedId!}
                  postId={current.id}
                  media={current.media}
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
