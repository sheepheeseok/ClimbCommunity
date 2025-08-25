import { useEffect, useState } from "react";
import { useUploadModalState } from "./useUploadModalState";
import { useUploadFiles } from "./useUploadFiles";
import { useUploadForm } from "./useUploadForm";
import api from "@/lib/axios";

export function useUploadModal() {
   const { isOpen, setOpen, step, setStep } = useUploadModalState();
   const { files, setFiles, removeFile, dropzone } = useUploadFiles();
   const form = useUploadForm();
   const [isUploading, setIsUploading] = useState(false);

   // 모달 닫힐 때 폼 초기화
   useEffect(() => {
      if (!isOpen) {
         setStep(1);
         setFiles([]);
         form.reset();
      }
   }, [isOpen]);

   // 간단 검증
   function validateInputs() {
      const { content, location, date } = form.getValues();
      const errors: string[] = [];
      if (!content?.trim()) errors.push("내용");
      if (!location?.trim()) errors.push("위치");
      if (!date?.trim()) errors.push("날짜");
      if (errors.length) {
         alert(`다음 항목을 입력해주세요: ${errors.join(", ")}`);
         return false;
      }
      return true;
   }

   // 게시물 업로드
   const handleUpload = async () => {
      if (!validateInputs()) return;

      try {
         setIsUploading(true);

         const {
            content,
            location,
            date,
            triedProblems,
            completedProblems,
         } = form.getValues();

         const formData = new FormData();
         const postDto = {
            content,
            category: "GENERAL",
            location,
            date,
            triedProblems,
            completedProblems,
         };
         formData.append("post", new Blob([JSON.stringify(postDto)], { type: "application/json" }));

         files.forEach((file) => {
            if (file.type?.startsWith("video")) {
               formData.append("videos", file);
            } else {
               formData.append("images", file);
            }
         });

         await api.post("/api/posts", formData, { timeout: 60_000 });

         // 성공 시 초기화
         setOpen(false);
      } catch (error) {
         alert("게시물 업로드 중 오류가 발생했습니다.");
      } finally {
         setIsUploading(false);
      }
   };

   return {
      isOpen,
      setOpen,
      step,
      setStep,
      files,
      setFiles,
      form,
      removeFile,
      handleUpload,
      dropzone,
      isUploading,
   };
}