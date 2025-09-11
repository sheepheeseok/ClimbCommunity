import { getThumbnails } from "video-metadata-thumbnails";

export const getVideoThumbnail = async (file: File): Promise<File> => {
    try {
        const thumbs = await getThumbnails(file, {
            quality: 0.8,
            start: 0.1, // 첫 0.1초 시점에서 캡처
        });

        const blob = thumbs[0].blob;
        if (!blob) throw new Error("썸네일 blob 생성 실패");

        const thumbFile = new File([blob], `${file.name}-thumbnail.jpg`, {
            type: "image/jpeg",
        });

        console.log("🎯 생성된 썸네일 파일:", thumbFile);
        return thumbFile;
    } catch (err) {
        console.error("❌ 썸네일 생성 실패:", err);
        throw err;
    }
};
