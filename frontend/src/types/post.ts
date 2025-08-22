import type { Author } from "./author";

export type PostMedia = {
   type: "image" | "video"
   url: string
   poster?: string
}

// 클라이밍 문제
export type Problem = {
   id: string;
   gradeLabel?: string; // 예: "V3", "Lv.6"
   attempts?: number;   // 시도 횟수
   clears: number;      // 성공 횟수
};

export type Post = {
   id: string;
   createdAt?: string;                     // "2025-08-10"
   location?: string;                      // "서울 클라이밍짐"
   text?: string;                          // 본문 텍스트(선택)
   media: PostMedia[];                     // 이미지/비디오 혼합 가능
   author: Author;                         // 작성자

   attemptsByGrade: number[] // [V1..V7]
   clearsByGrade: number[]
};


// 모달 열릴 때 추가로 가져오는 정보 (댓글, 좋아요)
export type PostEngagement = {
   likesCount: number;
   isLikedByMe: boolean;
   comments: Comment[];
};