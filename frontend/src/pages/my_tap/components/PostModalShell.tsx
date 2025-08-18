// 게시물 모달창 프레임
// 게시물 모달창 프레임 (센터링/높이 명시 버전)
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
   open: boolean;
   onOpenChange: (v: boolean) => void;
   onPrev: () => void;
   onNext: () => void;
   children: React.ReactNode;
   hasPrev?: boolean;
   hasNext?: boolean;
};

export default function PostModalShell({
   open, onOpenChange, onPrev, onNext, children, hasPrev = true, hasNext = true,
}: Props) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            className={`
          /* ✅ 중앙 고정 배치 강제 */
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          z-50
          /* ✅ 기본 스타일 */
          p-0 bg-transparent border-none shadow-none
          w-[min(96vw,1100px)] max-h-[90vh]
          /* shadcn 기본 Close(X) 숨기기 */
          [&>button:last-child]:hidden
        `}
         >
            {/* '모달 밖'처럼 보이는 좌/우 이동 버튼 */}
            <Button
               variant="secondary" size="icon" aria-label="이전 기록"
               disabled={!hasPrev} onClick={onPrev}
               className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-12 z-20
                     rounded-full shadow-md bg-black/60 text-white hover:bg-black/80
                     disabled:opacity-40 disabled:pointer-events-none"
            >
               <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
               variant="secondary" size="icon" aria-label="다음 기록"
               disabled={!hasNext} onClick={onNext}
               className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-12 z-20
                     rounded-full shadow-md bg-black/60 text-white hover:bg-black/80
                     disabled:opacity-40 disabled:pointer-events-none"
            >
               <ChevronRight className="h-5 w-5" />
            </Button>

            {/* ✅ 내부 콘텐츠: 높이/오버플로우 제어 */}
            <div className="w-full max-h-[90vh] overflow-hidden">
               {children}
            </div>
         </DialogContent>
      </Dialog>
   );
}
