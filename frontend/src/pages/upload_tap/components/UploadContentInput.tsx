// 업로드 탭 step2 = 운동 기록 내용 입력 부분

import { FormField, FormItem, FormControl } from "@/components/ui/form";

export default function UploadContentInput() {
  return (
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
  );
}