import { useEffect, useState } from "react";
import type { Post } from "@/types/post";
import type { PostComment } from "@/types/comment";

export type UserItem = { id: string; name: string; avatar?: string; isFollowing?: boolean };
export type SeedUser = { id: string; name: string; levelLabel: string; bio?: string; canEdit?: boolean };

export type MyPageData = {
   user: SeedUser;
   followers: UserItem[];
   following: UserItem[];
   attemptsByGrade: number[];
   clearsByGrade: number[];
   posts: Post[];
   commentsByPostId: Record<string, PostComment[]>;
};

/** ✅ 빈 기본값(항상 안전하게 렌더 가능) */
const EMPTY: MyPageData = {
   user: { id: "", name: "", levelLabel: "", bio: "", canEdit: false },
   followers: [],
   following: [],
   attemptsByGrade: [0, 0, 0, 0, 0, 0, 0],
   clearsByGrade: [0, 0, 0, 0, 0, 0, 0],
   posts: [],
   commentsByPostId: {},
};

// 같은 탭에서 중복 파싱 방지
let __cache: MyPageData | null = null;
let __ready = false;

// (옵션) 로컬에서만 경고 로그
const IS_LOCAL =
   typeof window !== "undefined" &&
   /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

/** H1에서 읽어 빈값 보정 + 준비 여부 반환 */
function readFromH1(): { data: MyPageData; ready: boolean } {
   const el = document.getElementById("__my-page-seed") as HTMLElement | null;
   if (!el) {
      if (IS_LOCAL) console.warn("[useMyPageData] H1 seed element not found");
      return { data: EMPTY, ready: false };
   }

   const get = <T,>(key: string, fallback: T): T => {
      const raw = el.dataset[key as keyof DOMStringMap];
      if (!raw) return fallback;
      try {
         return JSON.parse(raw) as T;
      } catch (e) {
         if (IS_LOCAL) console.warn(`[useMyPageData] JSON parse failed for data-${key}`, e, raw);
         return fallback;
      }
   };

   // ❗필드가 비어 있어도 EMPTY로 보정되므로 항상 안전한 객체가 만들어짐
   const user = get<SeedUser>("user", EMPTY.user);
   const followers = get<UserItem[]>("followers", EMPTY.followers);
   const following = get<UserItem[]>("following", EMPTY.following);
   const attemptsByGrade = get<number[]>("attempts", EMPTY.attemptsByGrade);
   const clearsByGrade = get<number[]>("clears", EMPTY.clearsByGrade);
   const posts = get<Post[]>("posts", EMPTY.posts);
   const commentsByPostId = get<Record<string, PostComment[]>>("comments", EMPTY.commentsByPostId);

   const data: MyPageData = {
      user,
      followers,
      following,
      attemptsByGrade: [...attemptsByGrade],
      clearsByGrade: [...clearsByGrade],
      posts,
      commentsByPostId,
   };

   // H1이 존재하면 seed는 로드된 것으로 간주
   return { data, ready: true };
}

/** ✅ 항상 non-null 반환 + ready 플래그 */
export function useMyPageData() {
   const [data, setData] = useState<MyPageData>(__cache ?? EMPTY);
   const [ready, setReady] = useState<boolean>(__ready);

   useEffect(() => {
      if (!__cache) {
         const { data: parsed, ready: r } = readFromH1();
         __cache = parsed;
         __ready = r;
      }
      setData(__cache);
      setReady(__ready);
   }, []);

   return { data, ready } as const; // 항상 동일한 형태
}
