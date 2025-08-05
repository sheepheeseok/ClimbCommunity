// 업로드 탭 - step1. 파일이 업로드 된 후 미리보기 스크롤

import { X } from "lucide-react";

export default function UploadPreviewList({
   files,
   removeFile
}: {
   files: File[];
   removeFile: (file: File) => void;
}) {
   return (
      <div className="flex gap-2 overflow-x-auto p-4 py-8">
         {files.map((file, idx) => {
            const preview = URL.createObjectURL(file);
            const isVideo = file.type.startsWith("video");
            return (
               <div key={idx} className="relative group flex-shrink-0 w-75 h-100">
                  {isVideo ? (
                     <video src={preview} className="w-full h-full object-cover rounded" controls />
                  ) : (
                     <img src={preview} alt={file.name} className="w-full h-full object-cover rounded" />
                  )}
                  {/* 미리보기 삭제 버튼 */}
                  <button
                     onClick={() => removeFile(file)}
                     className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-2 cursor-pointer"
                  >
                     <X className="w-4 h-4" />
                  </button>
               </div>
            );
         })}
      </div>
   );
}