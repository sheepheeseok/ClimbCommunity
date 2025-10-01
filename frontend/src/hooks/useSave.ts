// src/hooks/useSave.ts
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export function useSave(postId: number) {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ 초기 상태 조회
    useEffect(() => {
        let mounted = true;
        if (!postId) return;

        setLoading(true);
        api.get(`/api/posts/${postId}/save`)
            .then(res => {
                if (mounted) setSaved(res.data);
            })
            .catch(() => {
                if (mounted) setSaved(false);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [postId]);

    // ✅ 토글 핸들러
    const toggleSave = async () => {
        try {
            const res = await api.post(`/api/posts/${postId}/save`);
            setSaved(res.data); // 서버에서 true/false 반환
        } catch (err) {
            console.error("북마크 토글 실패:", err);
        }
    };

    return { saved, toggleSave, loading };
}
