// src/hooks/useUserSearch.ts
import { useState, useEffect } from "react";
import api from "@/lib/axios"; // 희석님이 이미 만든 axios 인스턴스
import { useAuth } from "@/hooks/useAuth";

interface UserResult {
    id: number;
    userId: string;
    username: string;
    profileImage: string;
}

export function useUserSearch(query: string) {
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.get<UserResult[]>("/api/users/search", {
                    params: { query },
                });
                setResults(res.data);
            } catch (err) {
                console.error("검색 API 오류:", err);
            } finally {
                setLoading(false);
            }
        }, 300); // ✅ debounce 0.3s

        return () => clearTimeout(timeout);
    }, [query]);

    return { results, loading };
}
