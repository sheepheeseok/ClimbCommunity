// 모달 로직 훅
import { useEffect } from "react";
import { useUploadModalState } from "./useUploadModalState";
import { useUploadFiles } from "./useUploadFiles";
import { useUploadForm } from "./useUploadForm";


export function useUploadModal() {
   const { open, setOpen, step, setStep } = useUploadModalState();
   const { files, setFiles, removeFile, dropzone } = useUploadFiles();
   const form = useUploadForm();

   // 모달 닫힐 때 폼 초기화
   useEffect(() => {
      if (!open) {
         setStep(1);
         setFiles([]);
         form.reset();
      }
   }, [open]);

   // 게시물 업로드
   const handleUpload = () => {
      // 저장 API 호출 코드 들어가는 부분
      console.log(form.getValues());

      // 업로드 성공 시
      setOpen(false); // 모달 닫기
      setStep(1);
      setFiles([]);
      form.reset();
   };

   return {
      open,
      setOpen,
      step,
      setStep,
      files,
      setFiles,
      form,
      removeFile,
      handleUpload,
      dropzone,
   };
}
