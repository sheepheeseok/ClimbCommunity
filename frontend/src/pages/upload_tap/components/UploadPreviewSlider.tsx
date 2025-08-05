// 업로드 탭 step2 - 첨부파일 미리보기 (삭제 불가)

export default function UploadPreviewSidebar({ files }: { files: File[] }) {
   return (
     <div className="w-[400px] p-4 overflow-y-auto overflow-hidden">
       <div className="flex gap-2 overflow-x-auto py-6">
         {files.map((file, idx) => {
           const preview = URL.createObjectURL(file);
           const isVideo = file.type.startsWith("video");
           return (
             <div key={idx} className="relative flex-shrink-0 w-45 h-60">
               {isVideo ? (
                 <video src={preview} className="w-full h-full object-cover rounded-lg" controls />
               ) : (
                 <img src={preview} alt={file.name} className="w-full h-full object-cover rounded-lg" />
               )}
             </div>
           );
         })}
       </div>
     </div>
   );
 }