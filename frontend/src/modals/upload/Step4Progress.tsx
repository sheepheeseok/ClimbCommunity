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
        <div className="animate-slideIn text-center py-12 flex flex-col items-center justify-center">
            {!isComplete ? (
                <>
                    {/* ✅ 원형 로딩 게이지 */}
                    <div className="relative w-32 h-32 mb-8">
                        {/* 원형 배경 */}
                        <div className="absolute inset-0 rounded-full bg-gray-200" />
                        {/* 진행도 conic-gradient */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(#3b82f6 ${uploadProgress * 3.6}deg, #e5e7eb ${uploadProgress * 3.6}deg)`,
                            }}
                        />
                        {/* 안쪽 원 */}
                        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                            <UploadIcon className="w-10 h-10 text-blue-600 animate-bounce" />
                        </div>
                    </div>

                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                        {isUploading ? "업로드 중..." : "업로드 준비 완료"}
                    </h4>

                    {isUploading && (
                        <p className="text-sm text-gray-600">
                            {Math.round(uploadProgress)}%
                        </p>
                    )}
                </>
            ) : (
                <>
                    {/* 완료 체크 아이콘 */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckIcon className="w-12 h-12 text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-green-600 mb-4">
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
