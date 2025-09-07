import { UploadIcon } from "@/components/icons/UploadIcons";
import { useRef } from "react";

type Props = {
    modal: any;
};

export default function Step3Thumbnail({ modal }: Props) {
    const {
        selectedFiles,
        setSelectedFiles,
        filePreviews,
        setFilePreviews,
        selectedThumbnail,
        setSelectedThumbnail,
    } = modal;

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ✅ 파일 선택 핸들러
    const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(
                (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
            );

            // 미리보기 URL 생성
            const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

            setSelectedFiles((prev: File[]) => [...prev, ...validFiles]);
            setFilePreviews((prev: string[]) => [...prev, ...newPreviews]);

            // reset input (같은 파일 다시 선택 가능)
            e.target.value = "";
        }
    };

    return (
        <div className="animate-slideIn">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">썸네일 선택</h4>
            <p className="text-gray-600 mb-6">대표 이미지를 선택하세요</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedFiles.map((file: File, index: number) => {
                    const isSelected = selectedThumbnail === index;

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedThumbnail(index)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all duration-200 ${
                                isSelected
                                    ? "border-blue-500 shadow-lg scale-105"
                                    : "border-transparent hover:border-gray-300"
                            }`}
                        >
                            {file.type.startsWith("image/") ? (
                                <img
                                    src={filePreviews[index]}
                                    alt={`Thumbnail ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={filePreviews[index]}
                                    className="w-full h-full object-cover"
                                    muted
                                />
                            )}

                            {/* 대표 뱃지 */}
                            <div
                                className={`absolute bottom-1 right-1 text-xs px-2 py-1 rounded ${
                                    isSelected
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                대표
                            </div>
                        </button>
                    );
                })}

                {/* ✅ 항상 우측 끝에 고정된 사진 추가 버튼 */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors duration-200"
                >
                    <UploadIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs">사진 추가</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        ref={fileInputRef}
                        onChange={handleAddFiles}
                        className="hidden"
                    />
                </button>
            </div>
        </div>
    );
}
