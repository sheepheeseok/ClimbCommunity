// 모달 열림/닫힘 & 현재 단계 관리 훅

import { useState } from "react";

export function useUploadModalState() {
   const [open, setOpen] = useState(false);
   const [step, setStep] = useState(1); // 모달 단계

   return { open, setOpen, step, setStep };
}