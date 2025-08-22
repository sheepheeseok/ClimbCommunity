import { useUploadModalOpen } from "@/stores/useUploadModalOpen"
import { useState, useEffect } from "react"
import ProfileHeaderSection from "./sections/ProfileHeaderSection";
import WorkoutSummarySection from "./sections/WorkoutSummary";
import PostsSection from "./sections/PostSection";
import { Post } from "@/types/post";

// 가데이터
const dummyPosts: Post[] = [
   {
      id: "p1",
      createdAt: "2025-08-10",
      location: "서울 클라이밍짐",
      text: "오늘은 몸이 가벼워서 V3 온사이트!",
      media: [{ type: "image", url: "https://picsum.photos/id/1011/1200/900" }],
      author: { id: "u1", nickname: "한상준", level: "Lv.7" },
      attemptsByGrade: [0, 2, 1, 0, 0, 0, 0],
      clearsByGrade: [0, 1, 1, 0, 0, 0, 0],
   },
   {
      id: "p2",
      createdAt: "2025-06-02",
      text: "세로 루트에서 템포 유지가 포인트.",
      media: [
         { type: "image", url: "https://picsum.photos/id/1027/1200/900" },
         { type: "image", url: "https://picsum.photos/id/1045/1200/900" },
      ],
      author: { id: "u2", nickname: "유나", level: "Lv.3" },
      attemptsByGrade: [4, 0, 0, 0, 0, 0, 0],
      clearsByGrade: [2, 0, 0, 0, 0, 0, 0],
   },
   {
      id: "p3",
      createdAt: "2025-07-15",
      location: "부산 볼더링센터",
      media: [{ type: "video", url: "/media/sample.mp4" }],
      author: { id: "u3", nickname: "소정", level: "Lv.5" },
      attemptsByGrade: [0, 0, 0, 5, 0, 0, 0],
      clearsByGrade: [0, 0, 0, 0, 0, 0, 0],
   },
]

const me = { id: "me" } // 내가 로그인했다고 가정

type UserItem = { id: string; name: string; avatar?: string; isFollowing?: boolean } // 유저 정보

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
