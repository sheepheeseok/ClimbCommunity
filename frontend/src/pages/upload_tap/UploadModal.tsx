import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useUploadModal } from "./hooks/useUploadModal";
import UploadStepSelect from "./components/UploadStepSelect";
import UploadStepForm from "./components/UploadStepForm";


export default function UploadModal({ trigger }: { trigger: React.ReactNode }) {
   const { isOpen, setOpen, step, setStep, files, form, removeFile, handleUpload, dropzone } = useUploadModal();
   const { getRootProps, getInputProps, isDragActive, open: openFileDialog } = dropzone;

   return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
         <DialogTrigger asChild>{trigger}</DialogTrigger>

         {/* 모달창 */}
         <DialogContent className="max-w-5xl min-w-3xl gap-0 p-0 rounded-2xl overflow-hidden [&>button:last-child]:hidden">
            {/* 스크린 리더용 제목 + 설명 */}
            <DialogTitle className="sr-only">게시물 업로드</DialogTitle>
            <DialogDescription className="sr-only">
               게시물 작성 및 사진 업로드를 위한 모달입니다.
            </DialogDescription>

            {/* 상단 헤더 */}
            <div className="flex justify-between items-center border-b px-1 py-1">
               {step === 1 ? (
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setOpen(false)} // 닫기
                     className="bg-transparent"
                  >
                     <X className="!w-6 !h-6" />
                  </Button>
               ) : (
                  <Button
                     variant="ghost"
                     onClick={() => setStep(1)} // 이전 단계로
                     className="text-blue-600 font-bold bg-transparent"
                  >
                     이전
                  </Button>
               )} {/* step 상단 */}
               <Button
                  variant="ghost"
                  className={`text-blue-600 bg-transparent font-bold ${files.length === 0 && step === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={files.length === 0 && step === 1}
                  onClick={() => step === 1 ? setStep(2) : handleUpload()}
               >
                  {step === 1 ? "다음" : "업로드"}
               </Button>
            </div>


            {/* 중앙 업로드 영역 */}
            {/* 1단계: 업로드 화면 */}
            {step === 1 ? (
               <UploadStepSelect
                  files={files}
                  isDragActive={isDragActive}
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  openFileDialog={openFileDialog}
                  removeFile={removeFile}
               />
            ) : (
               < UploadStepForm form={form} files={files} />
            )}
         </DialogContent >
      </Dialog >
   );
}