// services/uploadService.ts
import api from "@/lib/axios";

type UploadPostParams = {
    formData: {
        category: string;
        content: string;
        location?: string;
        date?: string;
        completedProblems: Record<string, number>;
        thumbnailIndex: number;   // ✅ 추가
    };
    files: File[];
    setProgress?: (progress: number) => void;
};

export async function uploadPost({ formData, files, setProgress }: UploadPostParams) {
    const request = new FormData();

    const postPayload = {
        category: formData.category,
        content: formData.content,
        location: formData.location ?? "", // 값 없으면 빈 문자열
        date: formData.date ?? null,
        completedProblems: formData.completedProblems ?? {},
        thumbnailIndex: formData.thumbnailIndex ?? 0,
    };

    // ✅ post JSON에 thumbnailIndex 포함
    request.append(
        "post",
        new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    files.forEach((file) => {
        if (file.type.startsWith("video")) {
            request.append("videos", file);
        } else {
            request.append("images", file);
        }
    });

    return api.post("/api/posts", request, {
        timeout: 60_000,
        onUploadProgress: (e) => {
            if (setProgress && e.total) {
                const percent = Math.round((e.loaded * 100) / e.total);
                setProgress(percent);
            }
        },
    });
}
