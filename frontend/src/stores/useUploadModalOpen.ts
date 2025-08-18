// 업로드 탭 열림/닫힘 관리
import { create } from "zustand";

interface UploadModalOpenState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useUploadModalOpen = create<UploadModalOpenState>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
