import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { MediaIcon } from "@/components/icons/MediaIcon";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";
import HoldCountSelector from "./HoldCountSelector";
import DatePickerField from "@/components/form/DatePickerField";
import LocationSelector from "@/components/form/LocationSelector";

interface UploadFormData {
   content: string;
   date?: string;
   location?: string;
   problems?: Record<string, number>; // 예: { red: 1, green: 3 }
}

export default function UploadModal({ trigger }: { trigger: React.ReactNode }) {
   const [open, setOpen] = useState(false);
   const [step, setStep] = useState(1); // 모달 단계
   const [files, setFiles] = useState<File[]>([]);

   useEffect(() => {
      if (!open) {
         setStep(1);
         setFiles([]);
         form.reset({
            content: "",
            date: "",
            location: "",
            problems: {}
         });
      }
   }, [open]);

   const form = useForm<UploadFormData>({
      defaultValues: {
         content: "",
      },
   });

   // 파일 드래그앤드랍
   const onDrop = useCallback((acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
   }, []);
   const { getRootProps, getInputProps, isDragActive, open: openFileDialog } = useDropzone({
      onDrop,
      accept: {
         "image/*": [],
         "video/*": []
      },
      multiple: true,
      noClick: true,
   });

   // 파일 삭제
   const removeFile = (file: File) => {
      setFiles((prev) => prev.filter((f) => f !== file));
   };

   // 게시물 업로드
   const handleUpload = () => {
      // 저장 API 호출 코드 들어가는 부분
      console.log(form.getValues());
      // 성공 시
      setOpen(false); // 모달 닫기
      setStep(1);
      setFiles([]);
      form.reset({
         content: "",
         date: "",
         location: "",
         problems: {}
      });
   };


   return (
      <Dialog
         open={open}
         onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
               setStep(1);
               setFiles([]);
               form.reset();
            }
         }}
      >
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
               )}
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
            {step === 1 && (
               files.length === 0 ? (
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
               ) : (
                  // 가로 스크롤 썸네일 영역
                  < div className="flex gap-2 overflow-x-auto p-4 py-8">
                     {files.map((file, idx) => {
                        const preview = URL.createObjectURL(file);
                        const isVideo = file.type.startsWith("video");
                        return (
                           <div
                              key={idx}
                              className="relative group flex-shrink-0 w-75 h-100"
                           >
                              {isVideo ? (
                                 <video
                                    src={preview}
                                    className="w-full h-full object-cover rounded"
                                    controls
                                 />
                              ) : (
                                 <img
                                    src={preview}
                                    alt={file.name}
                                    className="w-full h-full object-cover rounded"
                                 />
                              )}
                              {/* 삭제 버튼 */}
                              <button
                                 onClick={() => removeFile(file)}
                                 className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-2 opacity-0 opacity-100 transition cursor-pointer"
                              >
                                 <X className="w-4 h-4" />
                              </button>
                           </div>
                        );
                     })}
                  </div>
               )
            )}

            {/* 2단계: 작성 화면 */}
            {step === 2 && (
               <Form {...form}>
                  <form className="flex flex-col h-full">
                     {/* 첫 줄: 내용 (가로 2칸 차지) */}
                     <div className="p-4 border-b">
                        <FormField
                           name="content"
                           render={({ field }) => (
                              <FormItem>
                                 <FormControl>
                                    <textarea
                                       {...field}
                                       placeholder="클라이밍을 하며 느낀 소감을 작성해주세요."
                                       className="w-full min-h-[150px] focus:outline-none resize-none"
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* 두 번째 줄: 미디어 + 옵션 */}
                     <div className="flex flex-1 h-[600px]">
                        {/* 왼쪽: 첨부 파일 미리보기 */}
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

                        {/* 세로 구분선 */}
                        <div className="w-px bg-gray-200" />

                        {/* 오른쪽: 옵션 */}
                        <div className="p-4 flex flex-col flex-1 gap-4">
                           <DatePickerField name="date" />
                           <LocationSelector onSelect={(location) => form.setValue("location", location)} />
                           <div>
                              <HoldCountSelector label="시도 문제 수" />
                           </div>
                           <div>
                              <HoldCountSelector label="완등 문제 수" />
                           </div>
                        </div>
                     </div>
                  </form>
               </Form>
            )}
         </DialogContent >
      </Dialog >
   );
}