// react-hook-form 설정 관리 훅

import { useForm } from "react-hook-form";

export interface UploadFormData {
   title: string;
   content: string;
   category: string;
   date?: string;
   location?: string;
   triedProblems: Record<string, number>;     // 시도 문제 수
   completedProblems: Record<string, number>; // 완등 문제 수
}

export function useUploadForm() {
   return useForm<UploadFormData>({
      defaultValues: {
         title: "",     // 추가
         content: "",
         category: "",  // 추가
         location: "",
         date: "",
         triedProblems: {},
         completedProblems: {},
      },
   });
}
