export type PostMedia = {
   type: "image" | "video";
   url: string;
   poster?: string;
};

export type Post = {
   id: string;
   createdAt?: string;
   location?: string;
   media: PostMedia[];
   author?: import("./author").Author;
   // author, likes 등은 추후 확장
};