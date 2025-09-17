import api from "@/lib/axios";
import { PostThumbnail } from "@/hooks/ProfileHook";

interface UploadPostParams {
    formData: any;
    files: File[];
    thumbnails?: File[];
    setUploadProgress: (progress: number) => void;     // 0~100
    setProcessingProgress: (progress: number) => void; // 0~100
    setTotalProgress: (progress: number) => void;      // 0~100
}

export async function uploadPost({
                                     formData,
                                     files,
                                     thumbnails = [],
                                     setUploadProgress,
                                     setProcessingProgress,
                                     setTotalProgress,
                                 }: UploadPostParams) {
    const data = new FormData();

    // JSON DTO (post)
    const postBlob = new Blob([JSON.stringify(formData)], {
        type: "application/json",
    });
    data.append("post", postBlob);

    console.log("🚀 업로드 시작: formData =", formData);

    // 원본 파일 업로드
    files.forEach((file, index) => {
        data.append("files", file);
        data.append("fileOrder", String(index));
    });

    // 썸네일 업로드
    thumbnails.forEach((thumb, idx) => {
        console.log(`🖼 FormData thumbnails 추가 [${idx}]:`, thumb.name);
        data.append("thumbnails", thumb);
    });

    // === 1단계: 파일 업로드 (네트워크 전송 0~50%)
    const res = await api.post<PostThumbnail>("/api/posts", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                const weighted = Math.min(50, Math.round((percent / 100) * 50));

                console.log("⏳ 업로드 진행률:", percent, "% → 총:", weighted, "%");
                setUploadProgress(percent);
                setTotalProgress(weighted);
            }
        },
    });

    // === 2단계: ffmpeg 변환 진행률 (백엔드 폴링 50~100%)
    const hasVideo = files.some((file) => file.type.startsWith("video"));

    if (hasVideo) {
        try {
            const postId = res.data.id;
            let done = false;

            while (!done) {
                const progressRes = await api.get<{ progress: number; complete: boolean }>(
                    `/api/posts/${postId}/progress`
                );

                const processingPercent = progressRes.data.progress; // 0~100
                const weighted = 50 + Math.round((processingPercent / 100) * 50);

                console.log(
                    "🎬 변환 진행률:",
                    processingPercent,
                    "% → 총:",
                    weighted,
                    "%"
                );

                setProcessingProgress(processingPercent);
                setTotalProgress(weighted);

                if (progressRes.data.complete) {
                    done = true;
                } else {
                    await new Promise((r) => setTimeout(r, 1000));
                }
            }
        } catch (err) {
            console.warn("⚠️ 변환 진행률 조회 실패:", err);
        }
    } else {
        // ✅ 이미지 전용 게시물 → 변환 과정 스킵 후 즉시 완료 처리
        console.log("🖼 이미지 전용 업로드 → 변환 단계 건너뛰기");
        setProcessingProgress(100);
        setTotalProgress(100);
    }

    return res.data;
}
