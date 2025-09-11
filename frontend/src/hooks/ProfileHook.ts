import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useWebSocket } from "@/hooks/useWebSocket";
import { IMessage } from "@stomp/stompjs";

export interface PostThumbnail {
    id: number;
    thumbnailUrl: string;
}

export interface UserLite {
    userId: string;
    username: string;
    profileImage: string;
}

export interface Profile {
    userId: string;
    username: string;
    profileImage: string;
    grade: string;
    bio: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    posts: PostThumbnail[];

    savedPosts?: any[];
    taggedPosts?: any[];

    followers: UserLite[];
    following: UserLite[];
}

// ✅ 공통 훅
function useProfileFetcher(endpoint: string, userId?: string) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!endpoint) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get<Profile>(endpoint);
                setProfile(res.data);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);


    useWebSocket(
        userId
            ? [
                {
                    destination: `/topic/profile/${userId}`,
                    handler: (msg: IMessage) => {
                        try {
                            const newPost = JSON.parse(msg.body);
                            setProfile((prev) =>
                                prev
                                    ? {
                                        ...prev,
                                        posts: [newPost, ...prev.posts],
                                        stats: {
                                            ...prev.stats,
                                            posts: prev.stats.posts + 1, // ✅ 게시글 수 증가
                                        },
                                    }
                                    : prev
                            );
                        } catch (e) {
                            console.error("❌ WebSocket 메시지 파싱 실패:", e);
                        }
                    },
                },
            ]
            : []
    );

    return { profile, loading, error, setProfile };
}

// ✅ 내 프로필 조회
export function useMyProfile() {
    return useProfileFetcher("/api/users/me/profile");
}

// ✅ 특정 유저 프로필 조회
export function useUserProfile(userId: string) {
    return useProfileFetcher(userId ? `/api/users/${userId}/profile` : "", userId);
}
