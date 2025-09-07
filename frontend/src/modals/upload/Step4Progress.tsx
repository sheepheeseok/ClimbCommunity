// src/modals/upload/Step4Progress.tsx
import { UploadModalProps } from "@/hooks/UploadModalHook";
import { UploadIcon, CheckIcon } from "@/components/icons/UploadIcons";

type Props = {
    modal: UploadModalProps;
};

export default function Step4Progress({ modal }: Props) {
    const { uploadProgress, isUploading, isComplete, resetModal, setIsOpen } = modal;

    const handleClose = () => {
        resetModal();
        setIsOpen(false);
    };

    return (
        <div className="animate-slideIn text-center py-12">
            {/* 업로드 진행 중 */}
            {!isComplete ? (
                <>
                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                        <UploadIcon />
                    </div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                        {isUploading ? "업로드 중..." : "업로드 준비 완료"}
                    </h4>

                    {isUploading && (
                        <div className="w-full max-w-md mx-auto mb-4">
                            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {Math.round(uploadProgress)}%
                            </p>
                        </div>
                    )}
                </>
            ) : (
                /* 업로드 완료 */
                <>
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-8 h-8 text-green-500 animate-checkmark" />
                    </div>
                    <h4 className="text-xl font-semibold text-green-600 mb-4">
                        업로드 완료!
                    </h4>
                    <p className="text-gray-600 mb-6">
                        게시물이 성공적으로 업로드되었습니다.
                    </p>
                    <button
                        onClick={handleClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                    >
                        닫기
                    </button>
                </>
            )}
        </div>
    );
}
