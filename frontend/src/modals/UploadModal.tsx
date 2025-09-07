import { UploadModalHook } from "@/hooks/UploadModalHook";
import Step1File from "../modals/upload/Step1File";
import Step2Preview from "../modals/upload/Step2Preview";
import Step3Thumbnail from "../modals/upload/Step3Thumbnail";
import Step4Progress from "../modals/upload/Step4Progress";
import {
    UploadIcon,
    ImageIcon,
    LocationIcon,
    CheckIcon,
    CloseIcon,
} from "@/components/icons/UploadIcons";
import { motion, AnimatePresence } from "framer-motion";

type UploadModalProps = ReturnType<typeof UploadModalHook>;

export default function UploadModal({
                                        isOpen,
                                        setIsOpen,
                                        currentStep,
                                        setCurrentStep,
                                        resetModal,
                                        handleUpload,
                                        ...modal
                                    }: UploadModalProps) {
    if (!isOpen) return null;

    const handleClose = () => {
        resetModal();
        setIsOpen(false);
    };

    const steps = [
        { number: 1, title: "파일 선택" },
        { number: 2, title: "미리보기 & 상세 입력" },
        { number: 3, title: "썸네일 선택" },
        { number: 4, title: "업로드 진행" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glassmorphism rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl animate-fadeIn bg-gradient-to-br from-blue-50 via-white to-indigo-50
  ">
                {/* ✅ Header */}
                <div
                    className="flex items-center justify-between p-6 border-b border-white/20">
                    <h2 className="text-xl font-bold text-gray-800">새 게시물 만들기</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg text-black transition-colors"
                    >
                        <CloseIcon/>
                    </button>
                </div>

                {/* ✅ Step Indicator */}
                <div className="px-6 py-4 border-b border-white/20">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                        currentStep >= step.number
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-500"
                                    }`}
                                >
                                    {step.number}
                                </div>
                                <span
                                    className={`ml-2 text-sm font-medium whitespace-nowrap hidden sm:block ${
                                        currentStep >= step.number
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    }`}
                                >
                  {step.title}
                </span>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                                            currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ✅ Steps Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Step1File
                                    modal={{ isOpen, setIsOpen, currentStep, setCurrentStep, resetModal, handleUpload,...modal }}
                                />
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Step2Preview
                                    modal={{ isOpen, setIsOpen, currentStep, setCurrentStep, resetModal, handleUpload,...modal }}
                                />
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Step3Thumbnail
                                    modal={{ isOpen, setIsOpen, currentStep, setCurrentStep, resetModal, handleUpload,...modal }}
                                />
                            </motion.div>
                        )}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Step4Progress
                                    modal={{ isOpen, setIsOpen, currentStep, setCurrentStep, resetModal, handleUpload,...modal }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ✅ Footer */}
                {currentStep < 4 && (
                    <div className="flex items-center justify-between p-6 border-t border-white/20">
                        <button
                            disabled={currentStep === 1}
                            onClick={() => modal.prevStep()}
                            className="px-6 py-2 rounded-xl font-semibold transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                            이전
                        </button>
                        <button
                            disabled={!modal.isStepValid(currentStep)}  // ✅ 단계별 유효성 확인
                            onClick={currentStep === 3 ? handleUpload : () => modal.nextStep()}
                            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200
        ${modal.isStepValid(currentStep)
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-400 hover:bg-gray-300 cursor-not-allowed"}`}
                        >
                            {currentStep === 3 ? "업로드" : "다음"}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
