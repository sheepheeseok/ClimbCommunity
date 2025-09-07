// src/hooks/UploadModalHook.ts
import { useState, useRef } from "react";
import { uploadPost } from "@/services/uploadService";

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

    /** 파일 선택 */
    const handleFileSelection = (files: File[]) => {
        const validFiles = files.filter(
            (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
        );

        // ✅ 중복 제거 (file.name + file.size 기준)
        const uniqueFiles = validFiles.filter(
            (newFile) =>
                !selectedFiles.some(
                    (existingFile) =>
                        existingFile.name === newFile.name && existingFile.size === newFile.size
                )
        );

        setSelectedFiles((prev) => [...prev, ...uniqueFiles]);
        setFilePreviews((prev) => [...prev, ...uniqueFiles.map((file) => URL.createObjectURL(file))]);
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
        if (step === 1) {
            if (selectedFiles.length === 0) {
                alert("최소 1개의 이미지 또는 동영상을 선택하세요.");
                return false;
            }
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
        if (step === 3) {
            if (selectedThumbnail === null || selectedThumbnail < 0) {
                alert("대표 썸네일을 선택하세요.");
                return false;
            }
        }
        return true;
    };

    /** Step별 유효성 체크 (UI 반영용) */
    const isStepValid = (step: number) => {
        if (step === 1) {
            return selectedFiles.length > 0;
        }
        if (step === 2) {
            return formData.location.trim() !== "" && formData.content.trim() !== "";
        }
        if (step === 3) {
            return selectedThumbnail !== null && selectedThumbnail >= 0;
        }
        return true;
    };

    /** 업로드 실행 */
    const handleUpload = async () => {
        if (!validateInputs()) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);

            const completedProblems = {
                red: parseInt(formData.redCount || "0", 10),
                purple: parseInt(formData.purpleCount || "0", 10),
                brown: parseInt(formData.brownCount || "0", 10),
                black: parseInt(formData.blackCount || "0", 10),
                white: parseInt(formData.whiteCount || "0", 10),
            };

            await uploadPost({
                formData: {
                    category: "GENERAL",
                    content: formData.content,
                    location: formData.location,
                    completedProblems,   // ✅ Map 구조로 변환해서 전달
                    thumbnailIndex: selectedThumbnail,
                },
                files: selectedFiles,
                setProgress: setUploadProgress,
            });

            setIsComplete(true);
            setCurrentStep(4);
        } catch (error) {
            console.error("❌ 업로드 실패:", error);
            alert("게시물 업로드 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    /** Step 이동 */
    const nextStep = () => {
        if (!validateStep(currentStep)) return; // ✅ 현재 단계 검증
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

// ✅ UploadModal 컴포넌트에서 props 타입으로 사용 가능
export type UploadModalProps = ReturnType<typeof UploadModalHook>;
