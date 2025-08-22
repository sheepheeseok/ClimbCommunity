export type CommentAuthor = {
   id: string
   nickname: string
   level?: string
   avatarUrl?: string
}


export type PostComment = {
   id: string;
   author: CommentAuthor
   createdAt: string;   // ISO 문자열
   content: string      // plain text (줄바꿈 포함)
};
