export type Comment = {
    id: number;
    userId: string;
    username: string;
    profileImage?: string;
    content: string;
    likeCount: number;
    likedByMe: boolean;
    createdAt: string;
    replies?: Comment[];
};
