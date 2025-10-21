import { RefObject, useState } from "react";
import { UploadIcon } from "@/components/icons/UploadIcons";
import { createPortal } from "react-dom";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

type Props = {
    modal: {
        selectedFiles: File[];
        setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
        fileInputRef: RefObject<HTMLInputElement | null>;
        filePreviews: string[];
        setFilePreviews: React.Dispatch<React.SetStateAction<string[]>>;
    };
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

    /** ✅ input으로 파일 선택 */
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            addFiles(files);
        }
        e.target.value = "";
    };

    /** ✅ 공통 파일 처리 */
    const addFiles = async (files: File[]) => {
        const validFiles = files.filter(
            (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
        );
        if (validFiles.length === 0) return;

        const uniqueFiles = validFiles.filter(
            (newFile) =>
                !selectedFiles.some(
                    (existingFile) =>
                        existingFile.name === newFile.name &&
                        existingFile.size === newFile.size
                )
        );

        if (uniqueFiles.length < validFiles.length) {
            showToast("이미 선택된 파일은 제외되었습니다.");
        }

        const newPreviews: string[] = [];

        for (const file of uniqueFiles) {
            if (file.type === "video/quicktime" || file.name.toLowerCase().endsWith(".mov")) {
                try {
                    const thumb = await generateThumbnailSafe(file);
                    newPreviews.push(thumb);
                } catch {
                    showToast(".mov 썸네일을 생성할 수 없습니다.");
                    newPreviews.push(""); // fallback
                }
            } else {
                newPreviews.push(URL.createObjectURL(file));
            }
        }

        setSelectedFiles((prev) => [...prev, ...uniqueFiles]);
        setFilePreviews((prev) => [...prev, ...newPreviews]);
    };

    /** ✅ MOV 안전 썸네일 생성 */
    const generateThumbnailSafe = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.crossOrigin = "anonymous";
            video.muted = true;
            video.playsInline = true;
            video.preload = "auto";

            let resolved = false;

            video.addEventListener("loadedmetadata", () => {
                // metadata 로드 완료 후 0.5초 프레임으로 이동
                if (video.duration < 0.5) return reject("Too short");
                video.currentTime = Math.min(0.5, video.duration / 2);
            });

            video.addEventListener("seeked", () => {
                if (resolved) return;
                resolved = true;

                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("Canvas error");

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/png"));
            });

            video.onerror = () => reject("Video load error");

            // timeout fallback (10초 내 생성 안되면 실패 처리)
            setTimeout(() => {
                if (!resolved) reject("Timeout");
            }, 10000);
        });
    };

    /** ✅ 순서 변경 */
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const newFiles = Array.from(selectedFiles);
        const [movedFile] = newFiles.splice(result.source.index, 1);
        newFiles.splice(result.destination.index, 0, movedFile);

        const newPreviews = Array.from(filePreviews);
        const [movedPreview] = newPreviews.splice(result.source.index, 1);
        newPreviews.splice(result.destination.index, 0, movedPreview);

        setSelectedFiles(newFiles);
        setFilePreviews(newPreviews);
    };

    const showToast = (message: string) => {
        setToastMsg(message);
        setTimeout(() => setToastMsg(""), 2000);
    };

    return (
        <div className="animate-slideIn relative">
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
                )}

            {/* 업로드 영역 */}
            <div
                className="border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                    hover:border-blue-500 hover:shadow-lg"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    addFiles(Array.from(e.dataTransfer.files));
                }}
            >
                <UploadIcon />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    사진이나 동영상을 여기에 끌어다 놓으세요
                </h3>
                <p className="text-gray-500 mb-6">
                    또는 아래 버튼을 클릭하여 파일을 선택하세요
                </p>
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

            {/* ✅ 미리보기 */}
            {filePreviews.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">
                        선택된 파일
                    </h4>

                    <div
                        className="max-h-[50vh] overflow-y-auto pr-2
                            rounded-lg border border-gray-100
                            bg-white/50 backdrop-blur-sm"
                    >
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="files" direction="horizontal">
                                {(provided) => (
                                    <div
                                        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {filePreviews.map((url, index) => {
                                            const file = selectedFiles[index];
                                            if (!file) return null;
                                            const isImage = file.type.startsWith("image/");
                                            const isMov =
                                                file.type === "video/quicktime" ||
                                                file.name.toLowerCase().endsWith(".mov");

                                            return (
                                                <Draggable
                                                    key={file.name + index}
                                                    draggableId={file.name + index}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            className="relative group bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                                {url ? (
                                                                    isImage || isMov ? (
                                                                        <img
                                                                            src={url}
                                                                            alt={`Preview ${index}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <video
                                                                            src={url}
                                                                            className="w-full h-full object-cover"
                                                                            muted
                                                                            playsInline
                                                                            onLoadedData={(e) => {
                                                                                const v =
                                                                                    e.currentTarget;
                                                                                v.currentTime = 0;
                                                                                v.play().catch(() => {});
                                                                            }}
                                                                        />
                                                                    )
                                                                ) : (
                                                                    <div className="text-gray-400 text-sm">
                                                                        MOV 미리보기 불가
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    setSelectedFiles((prev) =>
                                                                        prev.filter(
                                                                            (_, i) => i !== index
                                                                        )
                                                                    );
                                                                    setFilePreviews((prev) =>
                                                                        prev.filter(
                                                                            (_, i) => i !== index
                                                                        )
                                                                    );
                                                                    if (fileInputRef.current)
                                                                        fileInputRef.current.value =
                                                                            "";
                                                                }}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl shadow-md"
                                                            >
                                                                ×
                                                            </button>

                                                            <p className="text-xs text-gray-600 mt-1 truncate px-1">
                                                                {file.name}
                                                            </p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            )}
        </div>
    );
}
