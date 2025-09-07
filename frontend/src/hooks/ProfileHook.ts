import { useEffect, useState } from "react";
import api from "@/lib/axios";

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
    posts: string[];
    savedPosts: string[];
    taggedPosts: string[];
}

interface UseProfileResult {
    profile: Profile | null;
    followers: UserLite[];
    following: UserLite[];
    loading: boolean;
    error: string | null;
}

export function ProfileHook(userId: string): UseProfileResult {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [followers, setFollowers] = useState<UserLite[]>([]);
    const [following, setFollowing] = useState<UserLite[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 프로필 정보
                const profileRes = await api.get<Profile>(`api/users/${userId}`);
                setProfile(profileRes.data);

                // 팔로워
                const followersRes = await api.get<UserLite[]>(`api/users/${userId}/followers`);
                setFollowers(followersRes.data);

                // 팔로잉
                const followingRes = await api.get<UserLite[]>(`api/users/${userId}/following`);
                setFollowing(followingRes.data);

                setError(null);
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return { profile, followers, following, loading, error };
}
