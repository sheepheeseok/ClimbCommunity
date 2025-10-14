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
    followStatus?: "PENDING" | "ACCEPTED";
}

export interface UserWithFollowing extends UserLite {
    following: boolean; // ✅ 팔로잉 여부 포함
}

export interface Profile {
    id: number;
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

    followers: UserWithFollowing[];
    following: UserWithFollowing[];

    isPrivate: boolean;
}

// ✅ 공통 프로필 조회 훅
function useProfileFetcher(endpoint: string, subscribeUserId?: string) {
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

    // ✅ 실시간 WebSocket 구독 (게시글 추가 반영)
    useWebSocket(
        subscribeUserId
            ? [
                {
                    destination: `/topic/profile/${subscribeUserId}`,
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
                                            posts: prev.stats.posts + 1,
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

// ✅ 특정 유저의 팔로워 목록 (팔로잉 여부 포함)
export function useFollowers(userId: string | undefined) {
    const [followers, setFollowers] = useState<UserWithFollowing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        const fetchFollowers = async () => {
            setLoading(true);
            try {
                const res = await api.get<UserWithFollowing[]>(`/api/users/${userId}/followers`);
                setFollowers(res.data); // ✅ following 필드 포함
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch followers");
            } finally {
                setLoading(false);
            }
        };
        fetchFollowers();
    }, [userId]);

    return { followers, loading, error, setFollowers };
}

// ✅ 특정 유저의 팔로잉 목록 (팔로잉 여부 포함)
export function useFollowing(userId: string | undefined) {
    const [following, setFollowing] = useState<UserWithFollowing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        const fetchFollowing = async () => {
            setLoading(true);
            try {
                const res = await api.get<UserWithFollowing[]>(`/api/users/${userId}/following`);
                setFollowing(res.data); // ✅ following 필드 포함
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch following");
            } finally {
                setLoading(false);
            }
        };
        fetchFollowing();
    }, [userId]);

    return { following, loading, error, setFollowing };
}

export function useSavedPosts() {
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            setLoading(true);
            try {
                const res = await api.get("/api/posts/saved");
                setSavedPosts(res.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch saved posts");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    return { savedPosts, loading, error, setSavedPosts };
}

// ✅ 태그된 게시물 목록 조회
export function useTaggedPosts() {
    const [taggedPosts, setTaggedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTaggedPosts = async () => {
            setLoading(true);
            try {
                const res = await api.get("/api/posts/tagged");
                setTaggedPosts(res.data);
                setError(null);
            } catch (err) {
                console.error("❌ Failed to fetch tagged posts:", err);
                setError("Failed to fetch tagged posts");
            } finally {
                setLoading(false);
            }
        };

        fetchTaggedPosts();
    }, []);

    return { taggedPosts, loading, error, setTaggedPosts };
}
