// 업로드 탭 step2 - 내용 입력

import { Form } from "@/components/ui/form";
import UploadContentInput from "./UploadContentInput";
import UploadPreviewSidebar from "./UploadPreviewSlider";
import UploadOptionsPanel from "./UploadOptionsPanel";

interface UploadStepFormProps {
   form: any;
   files: File[];
}

export default function UploadStepForm({ form, files }: UploadStepFormProps) {
   return (
      <Form {...form}>
         <form className="flex flex-col h-full">
            {/* 첫 줄: 내용 (가로 2칸 차지) */}
            <UploadContentInput />

            {/* 두 번째 줄: 미디어 + 옵션 */}
            <div className="flex flex-1 h-[600px]">
               {/* 왼쪽: 첨부 파일 미리보기 */}
               <UploadPreviewSidebar files={files} />

               {/* 세로 구분선 */}
               <div className="w-px bg-gray-200" />

               {/* 오른쪽: 옵션 */}
               <UploadOptionsPanel form={form} />
            </div>
         </form>
      </Form>
   );
}
