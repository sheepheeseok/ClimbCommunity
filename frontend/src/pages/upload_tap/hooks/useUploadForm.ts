// react-hook-form 설정 관리 훅

import { useForm } from "react-hook-form";

export interface UploadFormData {
   content: string;
   date?: string;
   location?: string;
   problems?: Record<string, number>; // 예: { red: 1, green: 3 }
}

export function useUploadForm() {
   return useForm<UploadFormData>({
      defaultValues: {
         content: "",
         date: "",
         location: "",
         problems: {},
      },
   });
}
