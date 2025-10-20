import { useState, useRef } from "react";
import { uploadPost } from "@/services/uploadService";
import { useMyProfile, PostThumbnail } from "@/hooks/ProfileHook";
import { getThumbnails } from "video-metadata-thumbnails";

interface FormData {
    category: string;
    location: string;
    content: string;
    redCount: string;
    purpleCount: string;
    brownCount: string;
    blackCount: string;
    whiteCount: string;
    taggedUsers: [],
}

// ✅ video-metadata-thumbnails 기반 wrapper
async function getVideoThumbnail(file: File): Promise<File> {
    const thumbs = await getThumbnails(file, {
        quality: 0.8,
        start: 0.1,
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
        taggedUsers: [],
    });

    // ✅ 진행률 상태
    const [uploadProgress, setUploadProgress] = useState(0);       // 네트워크 업로드 %
    const [processingProgress, setProcessingProgress] = useState(0); // ffmpeg 변환 %
    const [totalProgress, setTotalProgress] = useState(0);           // 합산 진행률 %

    const [isUploading, setIsUploading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [generatedThumbnails, setGeneratedThumbnails] = useState<File[]>([]);

    const { setProfile } = useMyProfile();

    /** Step별 유효성 체크 */
    const isStepValid = (step: number) => {
        if (step === 1) return selectedFiles.length > 0;
        if (step === 2)
            return formData.location.trim() !== "" && formData.content.trim() !== "";
        if (step === 3) return selectedThumbnail >= 0;
        return true;
    };

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
                        thumbnails.push(thumbFile);
                        previews.push(URL.createObjectURL(thumbFile));
                    } catch (err) {
                        console.error("비디오 썸네일 생성 실패:", err);
                        previews.push(URL.createObjectURL(file));
                    }
                } else {
                    previews.push(URL.createObjectURL(file));
                }
            })
        );

        setFilePreviews((prev) => [...prev, ...previews]);
        setGeneratedThumbnails((prev) => [...prev, ...thumbnails]);
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

    /** 업로드 실행 */
    const handleUpload = async () => {
        if (!validateInputs()) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);
            setProcessingProgress(0);
            setTotalProgress(0);
            setCurrentStep(4);

            const completedProblems = {
                red: parseInt(formData.redCount || "0", 10),
                purple: parseInt(formData.purpleCount || "0", 10),
                brown: parseInt(formData.brownCount || "0", 10),
                black: parseInt(formData.blackCount || "0", 10),
                white: parseInt(formData.whiteCount || "0", 10),
            };

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

            // ✅ 업로드 API 호출
            const newPost: PostThumbnail = await uploadPost({
                formData: {
                    category: "GENERAL",
                    content: formData.content,
                    location: formData.location,
                    completedProblems,
                    thumbnailIndex: 0,
                    taggedUsers: formData.taggedUsers || [],
                },
                files: selectedFiles,
                thumbnails: finalThumbnail ? [finalThumbnail] : [],
                setUploadProgress,
                setProcessingProgress,
                setTotalProgress,
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
    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
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
            taggedUsers: [],
        });
        setUploadProgress(0);
        setProcessingProgress(0);
        setTotalProgress(0);
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
        processingProgress,
        setProcessingProgress,
        totalProgress,
        setTotalProgress,
        isUploading,
        isStepValid,
        setIsUploading,
        isComplete,
        setIsComplete,
        fileInputRef,
        handleFileSelection,
        handleUpload,
        resetModal,
    };
}

export type UploadModalProps = ReturnType<typeof UploadModalHook>;
