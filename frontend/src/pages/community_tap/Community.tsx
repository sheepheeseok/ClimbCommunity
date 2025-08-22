import { useState, useEffect } from "react";
import PostContent from "./components/PostContent";

/** 카테고리 정의 */
const CATEGORIES = [
   { value: "all", label: "전체" },
   { value: "tips", label: "클라이밍팁" },
   { value: "events", label: "대회정보" },
   { value: "gear", label: "장비 추천" },
] as const;

export type CommunityCategory = typeof CATEGORIES[number]["value"];

function useCategoryFromURL(defaultValue: CommunityCategory = "all") {
   const [value, setValue] = useState<CommunityCategory>(defaultValue);

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat") as CommunityCategory | null;
      if (cat && CATEGORIES.some(c => c.value === cat)) setValue(cat);
   }, []);

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("cat", value);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
   }, [value]);

   return [value, setValue] as const;
}

/** ===== 가데이터 (카드에 들어갈 추천 게시물) ===== */
const MOCK_POSTS: Array<{
   id: string;
   cat: Exclude<CommunityCategory, "all">;
   title: string;
   media: { url: string; type?: "image" | "video" }[];
   author: { id: string; name: string; nickname: string; avatarUrl?: string };
   text?: string;
   createdAt?: string;
   location?: string;
}> = [
      {
         id: "p1",
         cat: "tips",
         title: "발가락 힘 키우는 풋워크 루틴",
         media: [
            { url: "/images/mock/footwork-1.jpg", type: "image" },
            { url: "/images/mock/footwork-2.jpg", type: "image" }, // 이미지 여러 개
         ],
         author: {
            id: "u1",
            name: "클라이머 A",
            nickname: "climberA",
            avatarUrl: "/avatars/a.png",
         },
         text: "슬랩에서 필요한 발끝 컨트롤 루틴 3가지 정리",
         createdAt: "2025-08-20",
         location: "서울 · OO짐",
      },
      {
         id: "p2",
         cat: "events",
         title: "9월 전국 아마추어 리드 대회 공지",
         media: [{ url: "/images/mock/event-1.jpg", type: "image" }], // 이미지 1개
         author: {
            id: "u2",
            name: "리드대회 운영위",
            nickname: "eventOrg",
         },
         text: "참가접수 8/31 마감! 상세 규정은 본문 참조",
         createdAt: "2025-09-01",
         location: "대전 · XX짐",
      },
      {
         id: "p3",
         cat: "gear",
         title: "가성비 초크백 3종 비교",
         media: [], // 이미지 없는 게시물
         author: {
            id: "u3",
            name: "기어덕",
            nickname: "gearLover",
         },
         text: "입구 고정력/분진 차단/세탁 편의성 기준으로 비교",
         createdAt: "2025-08-18",
      },
      {
         id: "p4",
         cat: "tips",
         title: "슬랩에서 중심 잡는 법",
         media: [{ url: "/images/mock/slab-1.jpg", type: "image" }],
         author: {
            id: "u4",
            name: "슬랩장인",
            nickname: "slabMaster",
         },
         text: "엉덩이-발끝 라인 정렬과 체중 이동 팁",
      },
   ];

export default function Community() {
   const [selected, setSelected] = useCategoryFromURL("all");

   // 필터링된 포스트
   const filtered = selected === "all"
      ? MOCK_POSTS
      : MOCK_POSTS.filter(p => p.cat === selected);

   return (
      <div className="w-full ml-0 lg:ml-[480px]">   {/* PC에서만 좌측 마진 들어감 */}
         {/* 상단 고정 필터 바 (사이드바 옆에서 시작) */}
         <div className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="px-24">
               <nav aria-label="커뮤니티 카테고리 필터">
                  <ul className="flex gap-1 sm:gap-2 py-2">
                     {CATEGORIES.map((cat) => {
                        const isActive = cat.value === selected;
                        return (
                           <li key={cat.value}>
                              <button
                                 type="button"
                                 onClick={() => setSelected(cat.value)}
                                 className={[
                                    "relative px-3 sm:px-4 h-9 rounded-full text-sm transition",
                                    isActive
                                       ? "font-semibold text-primary-foreground bg-primary"
                                       : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                 ].join(" ")}
                                 aria-current={isActive ? "page" : undefined}
                              >
                                 {cat.label}
                              </button>
                           </li>
                        );
                     })}
                  </ul>
               </nav>
            </div>
         </div>

         {/* 본문 영역: 추천 게시물 카드 리스트 */}
         <main className="max-w-4xl px-24 py-4 sm:py-6">
            <div className="grid gap-3 sm:gap-4">
               {filtered.map((p) => (
                  <article
                     key={p.id}
                     className="rounded-xl border hover:shadow-sm transition bg-background"
                  >
                     <PostContent
                        postId={p.id}
                        media={p.media as any}          // PostMedia 타입에 맞게 경로/필드 정리
                        author={p.author}
                        text={p.text}
                        attemptsByGrade={[]}           
                        clearsByGrade={[]}             
                        createdAt={p.createdAt}
                        location={p.location}
                        currentUserId={"me"}            // 로그인 유저 아이디로 치환
                        isFollowing={false}
                        followPending={false}
                        onToggleFollow={() => { }}
                     />
                  </article>
               ))}

               {filtered.length === 0 && (
                  <div className="text-sm text-muted-foreground py-8 text-center">
                     해당 카테고리의 게시물이 없습니다.
                  </div>
               )}
            </div>
         </main>
      </div>
   );
}
