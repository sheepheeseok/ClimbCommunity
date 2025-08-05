// 업로드 탭 - step1. 파일이 아직 업로드되지 않았을 때

import { MediaIcon } from "@/components/icons/MediaIcon";
import { Button } from "@/components/ui/button";

export default function UploadEmptyState({
   isDragActive,
   getRootProps,
   getInputProps,
   openFileDialog
}: {
   isDragActive: boolean;
   getRootProps: any;
   getInputProps: any;
   openFileDialog: () => void;
}) {
   return (
      <div
         {...getRootProps()}
         className="flex flex-col items-center justify-center py-30 gap-4 rounded-lg"
      >
         <input {...getInputProps()} />
         <MediaIcon className="w-36 h-36" />
         <p className="text-black">
            {isDragActive ? "여기에 파일을 놓으세요" : "사진과 동영상을 여기에 끌어다 놓으세요."}
         </p>
         <Button className="font-bold cursor-pointer" type="button" onClick={openFileDialog}>
            사진 및 동영상 추가
         </Button>
      </div>
   );
}