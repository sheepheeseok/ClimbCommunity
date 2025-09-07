import { useState } from "react";
import { UploadIcon } from "@/components/icons/UploadIcons";
import { createPortal } from "react-dom";

type Props = {
    modal: any;
};

export default function Step1File({ modal }: Props) {
    const {
        selectedFiles,
        setSelectedFiles,
        fileInputRef,
        filePreviews,
        setFilePreviews,
    } = modal;

    const [toastMsg, setToastMsg] = useState("");

    /** input으로 파일 선택 */
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            addFiles(files);
        }
        // ✅ 항상 초기화 → 같은 파일도 다시 선택 가능
        e.target.value = "";
    };

    /** Drag & Drop / Input 공통 처리 */
    const addFiles = (files: File[]) => {
        const validFiles = files.filter(
            (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
        );
        if (validFiles.length === 0) return;

        // ✅ 중복 제거
        const uniqueFiles = validFiles.filter(
            (newFile) =>
                !selectedFiles.some(
                    (existingFile: File) =>
                        existingFile.name === newFile.name && existingFile.size === newFile.size
                )
        );

        if (uniqueFiles.length < validFiles.length) {
            showToast("이미 선택된 파일은 제외되었습니다.");
        }

        setSelectedFiles((prev: File[]) => [...prev, ...uniqueFiles]);
        const newPreviews = uniqueFiles.map((file) => URL.createObjectURL(file));
        setFilePreviews((prev: string[]) => [...prev, ...newPreviews]);
    };

    /** ✅ 토스트 띄우기 */
    const showToast = (message: string) => {
        setToastMsg(message);
        setTimeout(() => setToastMsg(""), 2000); // 2초 후 사라짐
    };

    return (
        <div className="animate-slideIn relative">
            {/* ✅ Toast 메시지 */}
            {toastMsg &&
                createPortal(
                    <div
                        className="fixed top-32 left-1/2 transform -translate-x-1/2
                 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg
                 z-[9999] animate-fadeIn"
                    >
                        {toastMsg}
                    </div>,
                    document.body
                )
            }

            {/* Drag & Drop 영역 */}
            <div
                className="border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                    hover:border-blue-500 hover:shadow-lg"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    addFiles(files);
                }}
            >
                <UploadIcon />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    사진이나 동영상을 여기에 끌어다 놓으세요
                </h3>
                <p className="text-gray-500 mb-6">또는 아래 버튼을 클릭하여 파일을 선택하세요</p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
                >
                    파일 선택
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                />
            </div>

            {/* 선택된 파일 프리뷰 */}
            {filePreviews.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">선택된 파일</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filePreviews.map((url: string, index: number) => {
                            const file = selectedFiles[index];
                            if (!file) return null;
                            const isImage = file.type.startsWith("image/");

                            return (
                                <div
                                    key={index}
                                    className="relative group bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        {isImage ? (
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video src={url} className="w-full h-full object-cover" muted />
                                        )}
                                    </div>
                                    {/* 삭제 버튼 */}
                                    <button
                                        onClick={() => {
                                            setSelectedFiles((prev: File[]) =>
                                                prev.filter((_, i) => i !== index)
                                            );
                                            setFilePreviews((prev: string[]) =>
                                                prev.filter((_, i) => i !== index)
                                            );
                                            // ✅ 삭제 시에도 input 초기화 → 같은 파일 다시 등록 가능
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full
                                            flex items-center justify-center text-xl font-normal transition-colors duration-200 shadow-md"
                                    >
                                        ×
                                    </button>
                                    <p className="text-xs text-gray-600 mt-1 truncate px-1">{file.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
