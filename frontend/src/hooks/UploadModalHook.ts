import { useState, useRef } from "react";
import { uploadPost } from "@/services/uploadService";
import { useMyProfile } from "@/hooks/ProfileHook";
import { getThumbnails } from "video-metadata-thumbnails";
import { PostThumbnail } from "@/hooks/ProfileHook"; // ✅ 타입 import

interface FormData {
    category: string;
    location: string;
    content: string;
    redCount: string;
    purpleCount: string;
    brownCount: string;
    blackCount: string;
    whiteCount: string;
}

// 썸네일 매핑 구조
interface GeneratedThumbnail {
    originalIndex: number; // ✅ selectedFiles 배열 기준 index
    file: File;
}

// ✅ video-metadata-thumbnails 기반 wrapper
async function getVideoThumbnail(file: File): Promise<File> {
    const thumbs = await getThumbnails(file, {
        quality: 0.8,
        start: 0.1, // 0.1초 위치에서 캡처
    });

    const blob = thumbs[0]?.blob;
    if (!blob) throw new Error("썸네일 blob 생성 실패");

    return new File([blob], `${file.name}-thumbnail.jpg`, {
        type: "image/jpeg",
    });
}

export function UploadModalHook() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        category: "GENERAL",
        content: "",
        location: "",
        redCount: "",
        purpleCount: "",
        brownCount: "",
        blackCount: "",
        whiteCount: "",
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [generatedThumbnails, setGeneratedThumbnails] = useState<File[]>([]);

    const { setProfile } = useMyProfile();

    /** 파일 선택 */
    const handleFileSelection = async (files: File[]) => {
        const validFiles = files.filter(
            (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
        );

        const uniqueFiles = validFiles.filter(
            (newFile) =>
                !selectedFiles.some(
                    (existingFile) =>
                        existingFile.name === newFile.name && existingFile.size === newFile.size
                )
        );

        setSelectedFiles((prev) => [...prev, ...uniqueFiles]);

        const previews: string[] = [];
        const thumbnails: File[] = [];

        await Promise.all(
            uniqueFiles.map(async (file) => {
                if (file.type.startsWith("video/")) {
                    try {
                        const thumbFile = await getVideoThumbnail(file);
                        console.log("🎯 비디오 → 썸네일 변환 성공:", thumbFile);

                        thumbnails.push(thumbFile);
                        previews.push(URL.createObjectURL(thumbFile));
                    } catch (err) {
                        console.error("비디오 썸네일 생성 실패:", err);
                        previews.push(URL.createObjectURL(file)); // fallback
                    }
                } else {
                    previews.push(URL.createObjectURL(file));
                }
            })
        );

        setFilePreviews((prev) => [...prev, ...previews]);
        setGeneratedThumbnails((prev) => {
            const updated = [...prev, ...thumbnails];
            console.log("✅ 최종 generatedThumbnails 업데이트:", updated);
            return updated;
        });
    };

    /** 입력값 검증 */
    const validateInputs = () => {
        const errors: string[] = [];
        if (!formData.content.trim()) errors.push("내용");
        if (!formData.location.trim()) errors.push("위치");
        if (errors.length) {
            alert(`다음 항목을 입력해주세요: ${errors.join(", ")}`);
            return false;
        }
        return true;
    };

    /** Step별 입력 검증 */
    const validateStep = (step: number) => {
        if (step === 1 && selectedFiles.length === 0) {
            alert("최소 1개의 이미지 또는 동영상을 선택하세요.");
            return false;
        }
        if (step === 2) {
            if (!formData.location.trim()) {
                alert("장소를 입력하세요.");
                return false;
            }
            if (!formData.content.trim()) {
                alert("게시물 내용을 입력하세요.");
                return false;
            }
        }
        if (step === 3 && (selectedThumbnail === null || selectedThumbnail < 0)) {
            alert("대표 썸네일을 선택하세요.");
            return false;
        }
        return true;
    };

    /** Step별 유효성 체크 (UI 반영용) */
    const isStepValid = (step: number) => {
        if (step === 1) return selectedFiles.length > 0;
        if (step === 2)
            return formData.location.trim() !== "" && formData.content.trim() !== "";
        if (step === 3) return selectedThumbnail !== null && selectedThumbnail >= 0;
        return true;
    };

    /** 업로드 실행 */
    const handleUpload = async () => {
        if (!validateInputs()) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);
            setCurrentStep(4); // 업로드 진행 화면으로 이동

            const completedProblems = {
                red: parseInt(formData.redCount || "0", 10),
                purple: parseInt(formData.purpleCount || "0", 10),
                brown: parseInt(formData.brownCount || "0", 10),
                black: parseInt(formData.blackCount || "0", 10),
                white: parseInt(formData.whiteCount || "0", 10),
            };

            // ✅ 대표 썸네일 후보
            let finalThumbnail: File | null = null;
            const selectedFile = selectedFiles[selectedThumbnail];
            if (selectedFile) {
                if (selectedFile.type.startsWith("video/")) {
                    try {
                        finalThumbnail = await getVideoThumbnail(selectedFile);
                    } catch (e) {
                        console.warn("⚠️ 비디오 썸네일 생성 실패:", e);
                    }
                } else if (selectedFile.type.startsWith("image/")) {
                    finalThumbnail = selectedFile;
                }
            }

            console.log("📌 최종 업로드 thumbnail:", finalThumbnail);

            // ✅ 업로드 API 호출 → 새 게시물(PostThumbnail) 반환
            const newPost: PostThumbnail = await uploadPost({
                formData: {
                    category: "GENERAL",
                    content: formData.content,
                    location: formData.location,
                    completedProblems,
                    thumbnailIndex: 0,
                },
                files: selectedFiles,
                thumbnails: finalThumbnail ? [finalThumbnail] : [],
                setProgress: setUploadProgress,
            });

            // ✅ 내 프로필 즉시 갱신
            setProfile((prev) =>
                prev
                    ? {
                        ...prev,
                        posts: [newPost, ...prev.posts],
                        stats: {
                            ...prev.stats,
                            posts: prev.stats.posts + 1,
                        },
                    }
                    : prev
            );

            setIsComplete(true);
        } catch (error) {
            console.error("❌ 업로드 실패:", error);
            alert("게시물 업로드 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    /** Step 이동 */
    const nextStep = () => {
        if (!validateStep(currentStep)) return;
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    /** 모달 리셋 */
    const resetModal = () => {
        setCurrentStep(1);
        setSelectedFiles([]);
        setSelectedThumbnail(0);
        setFormData({
            category: "GENERAL",
            content: "",
            location: "",
            redCount: "",
            purpleCount: "",
            brownCount: "",
            blackCount: "",
            whiteCount: "",
        });
        setUploadProgress(0);
        setIsUploading(false);
        setIsComplete(false);
        setFilePreviews([]);
        setGeneratedThumbnails([]);
    };

    return {
        isOpen,
        setIsOpen,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        selectedFiles,
        setSelectedFiles,
        filePreviews,
        setFilePreviews,
        selectedThumbnail,
        setSelectedThumbnail,
        formData,
        setFormData,
        uploadProgress,
        setUploadProgress,
        isUploading,
        setIsUploading,
        isComplete,
        setIsComplete,
        fileInputRef,
        handleFileSelection,
        handleUpload,
        resetModal,
        isStepValid,
    };
}

export type UploadModalProps = ReturnType<typeof UploadModalHook>;
