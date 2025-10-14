import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

export interface MediaItem {
    id: string;
    type: "image" | "video";
    url: string;
    thumbnail?: string;
}

export interface ClimbingGrade {
    color: string;
    label: string;
    count: number;
}

export interface PostData {
    id?: number;
    content: string;
    location: string;
    media: MediaItem[];
    climbingGrades: ClimbingGrade[];
    isPublic: boolean;
}

/**
 * 게시물 수정/조회 전용 Hook
 * @param postId 게시물 ID
 */
export function useEditPost(postId: string | undefined) {
    const [postData, setPostData] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    // ✅ 게시물 불러오기
    useEffect(() => {
        if (!postId) return;
        setLoading(true);
        api
            .get(`/api/posts/${postId}`)
            .then((res) => {
                const data = res.data;
                setPostData({
                    id: data.id,
                    content: data.content,
                    location: data.location ?? "",
                    media: data.mediaList || [],
                    climbingGrades: data.completedProblems
                        ? Object.entries(data.completedProblems).map(([label, count]) => ({
                            color: colorMap[label] ?? "bg-gray-400",
                            label,
                            count: Number(count),
                        }))
                        : [],
                    isPublic: data.isPublic ?? true,
                });
            })
            .catch(() => setError("게시물을 불러오지 못했습니다."))
            .finally(() => setLoading(false));
    }, [postId]);

    // ✅ 게시물 수정 저장
    const savePost = async () => {
        if (!postData?.id) return;
        try {
            setSaving(true);
            await api.patch(`/api/posts/${postData.id}`, {
                content: postData.content,
                location: postData.location,
                completedProblems: Object.fromEntries(
                    postData.climbingGrades.map((g) => [g.label, g.count])
                ),
            });
            alert("게시물이 수정되었습니다.");
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert("수정에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return { postData, setPostData, loading, saving, error, savePost };
}

// ✅ 색상 매핑 테이블
const colorMap: Record<string, string> = {
    빨강: "bg-red-500",
    주황: "bg-orange-500",
    노랑: "bg-yellow-500",
    초록: "bg-green-500",
    파랑: "bg-blue-500",
    보라: "bg-purple-500",
};
