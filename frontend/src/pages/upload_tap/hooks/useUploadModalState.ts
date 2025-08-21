// 현재 단계 + 전역 열림/닫힘 상태 관리 훅
import { useState } from "react";
import { useUploadModalOpen } from "@/stores/useUploadModalOpen";

export function useUploadModalState() {
  // 전역 상태
  const { isOpen, setOpen } = useUploadModalOpen();

  // 로컬 상태
  const [step, setStep] = useState(1);

  return { isOpen, setOpen, step, setStep };
}
