// 파일 업로드(드래그앤드롭 + 파일 추가/삭제) 로직 관리 훅

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function useUploadFiles() {
   const [files, setFiles] = useState<File[]>([]);

   // 파일 드래그앤드랍
   const onDrop = useCallback((acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
   }, []);

   // 파일 삭제
   const removeFile = (file: File) => setFiles((prev) => prev.filter((f) => f !== file));

   const dropzone = useDropzone({
      onDrop,
      accept: { "image/*": [], "video/*": [] },
      multiple: true,
      noClick: true,
   });

   return { files, setFiles, removeFile, dropzone };
}
