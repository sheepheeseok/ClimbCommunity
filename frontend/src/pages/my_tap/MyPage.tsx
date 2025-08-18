import { useUploadModalOpen } from "@/stores/useUploadModalOpen"
import { useState, useEffect } from "react"
import ProfileHeaderSection from "./sections/ProfileHeaderSection";
import WorkoutSummarySection from "./sections/WorkoutSummary";
import PostsSection from "./sections/PostSection";


// 가데이터
export type Post = {
   id: string;          // 게시물 ID (필수)
   createdAt?: string;  // ISO 날짜 문자열 ("2025-08-10")
   location?: string;   // 위치 정보 ("서울 클라이밍짐")
   media: { type: "image" | "video"; url: string; poster?: string }[]; // ✅ 단일 배열
};
type UserItem = { id: string; name: string; avatar?: string; isFollowing?: boolean } // 유저 정보

const dummyPosts: Post[] = [
   {
      id: "p1",
      createdAt: "2025-08-10",
      location: "서울 클라이밍짐",
      media: [
         { type: "image", url: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a3?q=80&w=800&auto=format" },
      ],
   },
   {
      id: "p2",
      createdAt: "2025-06-02",
      media: [
         { type: "image", url: "https://picsum.photos/id/1050/800/1066" },
      ],
   },
   {
      id: "p3",
      location: "야외 암장(인수봉)",
      media: [
         { type: "image", url: "https://picsum.photos/id/1011/800/1066" },
      ],
   },
   {
      id: "p4",
      createdAt: "2025-07-15",
      location: "부산 볼더링센터",
      media: [
         // mp4는 같은 오리진(예: public/media/sample.mp4)에서 서빙 권장
         { type: "video", url: "/media/sample.mp4" },
      ],
   },
   {
      id: "p5",
      media: [
         { type: "image", url: "https://picsum.photos/id/1027/800/1066" },
      ],
   },
];

// 난이도별 문제배열
const attempts = [2, 1, 3, 3, 1, 1, 1]
const clears = [1, 1, 2, 0, 0, 0, 0]

// 더미 유저 목록
const followers: UserItem[] = [
   { id: "1", name: "한상준", isFollowing: true },
   { id: "2", name: "유나" },
]
const following: UserItem[] = [
   { id: "3", name: "소정", isFollowing: true },
]

// 마이 페이지
export default function MyPage() {
   const { setOpen: openUpload } = useUploadModalOpen()  // 업로드 탭 오픈용
   const [tab, setTab] = useState<"posts" | "tab2">("posts")  // 탭 전환

   return (
      <div className="w-full grid grid-cols-12 gap-6 p-6 ml-0 lg:ml-[250px]">   {/* PC에서만 좌측 마진 들어감 */}

         <section className="col-span-12 lg:col-span-7 lg:col-start-3 space-y-4">
            {/* 1. 헤더: 프로필 + 팔로우/팔로잉 + 레벨 */}
            <ProfileHeaderSection
               user={{ id: "me", name: "닉네임", levelLabel: "Lv3", bio: "한 줄 소개글", canEdit: true }}
               followers={followers}
               following={following}
            />

            {/* 2. 운동 기록 요약 */}
            <WorkoutSummarySection
               attemptsByGrade={attempts}
               clearsByGrade={clears}
               onGoUpload={() => openUpload(true)}
            />

            {/* 3. 탭: 게시물 / (빈)탭2 */}
            <PostsSection
               tab={tab}
               onTabChange={setTab}
               posts={dummyPosts}
            />

         </section>
      </div >
   )
}
