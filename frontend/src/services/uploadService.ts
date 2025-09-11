import api from "@/lib/axios";
import { PostThumbnail } from "@/hooks/ProfileHook";

interface UploadPostParams {
    formData: any;
    files: File[];
    thumbnails?: File[];
    setProgress: (progress: number) => void;
}

export async function uploadPost({
                                     formData,
                                     files,
                                     thumbnails = [],
                                     setProgress,
                                 }: UploadPostParams) {
    const data = new FormData();

    // JSON DTO (post)
    const postBlob = new Blob([JSON.stringify(formData)], { type: "application/json" });
    data.append("post", postBlob);

    console.log("🚀 업로드 시작: formData =", formData);

    // 원본 파일 업로드
    files.forEach((file, index) => {
        data.append("files", file);
        data.append("fileOrder", String(index)); // ✅ orderIndex 같이 보냄
    });

    // 썸네일 업로드
    thumbnails.forEach((thumb, idx) => {
        console.log(
            `🖼 FormData thumbnails 추가 [${idx}]:`,
            thumb.name,
            thumb.type,
            thumb.size
        );
        data.append("thumbnails", thumb);
    });

    // 최종 FormData 확인
    console.log("📌 최종 FormData files:", data.getAll("files"));
    console.log("📌 최종 FormData thumbnails:", data.getAll("thumbnails"));

    const res = await api.post<PostThumbnail>("/api/posts", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log("⏳ 업로드 진행률:", percent, "%");
                setProgress(percent);
            }
        },
    });

    return res.data; // ✅ 반드시 반환
}
