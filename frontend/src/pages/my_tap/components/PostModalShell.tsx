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
   open, onOpenChange, onPrev, onNext, children,
   hasPrev = true, hasNext = true,
}: Props) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            className={`
          fixed left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2
          z-50 p-0 bg-transparent border-none shadow-none
          [&>button:last-child]:hidden
        `}
         // 여기 위쪽 다시 고쳐야
         >
            {/* 내부 콘텐츠가 직접 사이즈 관리 */}
            <div className="inline-block">{children}</div>
         </DialogContent>
         {open && (
            <>
               <Button
                  variant="secondary"
                  size="icon"
                  aria-label="이전 기록"
                  disabled={!hasPrev}
                  onClick={onPrev}
                  className={`
          hidden sm:flex
          fixed left-[max(180px,env(safe-area-inset-left))]
          top-1/2 -translate-y-1/2
          z-[60] rounded-full shadow-md
          bg-black/60 text-white hover:bg-black/80
          disabled:opacity-40 disabled:pointer-events-none
        `}
               >
                  <ChevronLeft className="h-5 w-5" />
               </Button>

               <Button
                  variant="secondary"
                  size="icon"
                  aria-label="다음 기록"
                  disabled={!hasNext}
                  onClick={onNext}
                  className={`
          hidden sm:flex
          fixed right-[max(180px,env(safe-area-inset-right))]
          top-1/2 -translate-y-1/2
          z-[60] rounded-full shadow-md
          bg-black/60 text-white hover:bg-black/80
          disabled:opacity-40 disabled:pointer-events-none
        `}
               >
                  <ChevronRight className="h-5 w-5" />
               </Button>
            </>
         )}
      </Dialog>
   );
}
