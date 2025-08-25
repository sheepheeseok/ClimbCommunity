import React, { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type RatingProps = {
   value: number;
   onChange?: (v: number) => void; // 없으면 읽기 전용 모드
   max?: number; // 기본 5
   size?: number; // px, 기본 20
   readOnly?: boolean; // 강제 읽기 전용
   disabled?: boolean;
   showValue?: boolean; // 숫자 노출
   className?: string;
   "aria-label"?: string;
};

/**
 * Rating — shadcn 스타일의 별점 컴포넌트
 * - `onChange`가 없거나 `readOnly`이면 표시 전용 모드
 * - 표시 전용은 소수점(예: 4.3)까지 부분 채움
 * - 입력 모드는 RadioGroup + Label 조합(접근성 OK)
 */
export default function Rating({
   value,
   onChange,
   max = 5,
   size = 20,
   readOnly,
   disabled,
   showValue,
   className = "",
   ...a11y
}: RatingProps) {
   const clamped = clamp(value, 0, max);

   if (readOnly || !onChange) {
      return (
         <div className={`inline-flex items-center gap-2 ${className}`} aria-label={a11y["aria-label"] ?? `별점 ${clamped.toFixed(1)} / ${max}`}>
            <StarRow value={clamped} max={max} size={size} />
            {showValue && <span className="text-sm">{clamped.toFixed(1)}</span>}
         </div>
      );
   }

   const idBase = useId();

   return (
      <div className={`inline-flex items-center gap-2 ${className}`} aria-label={a11y["aria-label"] ?? `별점 선택`}>
         <RadioGroup
            className="flex items-center gap-1"
            value={String(clamped)}
            onValueChange={(v: string) => onChange?.(Number(v))}
         >
            {/* 별 아이콘은 선택 값과 무관하게 부분 채움으로 표시, 클릭은 라디오가 담당 */}
            <div className="relative">
               <StarRow value={clamped} max={max} size={size} />

               {/* 클릭 타깃: 각 별에 대응하는 라벨 */}
               <div className="absolute inset-0 flex items-center gap-1">
                  {Array.from({ length: max }).map((_: unknown, i: number) => {
                     const v = i + 1;
                     const id = `${idBase}-${v}`;
                     return (
                        <Label key={v} htmlFor={id} className={`cursor-pointer ${disabled ? "pointer-events-none opacity-60" : ""}`} style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                           <RadioGroupItem
                              id={id}
                              value={String(v)}
                              className="sr-only"
                              disabled={disabled}
                           />
                           <span className="sr-only">{v}점</span>
                        </Label>
                     );
                  })}
               </div>
            </div>
         </RadioGroup>
         {showValue && <span className="text-sm">{clamped.toFixed(1)}</span>}
      </div>
   );
}

/* -------------------- 표시 전용 별 행 -------------------- */
function StarRow({ value, max, size }: { value: number; max: number; size: number }) {
   return (
      <div className="relative inline-flex" aria-hidden>
         {/* 배경(회색) */}
         <div className="flex gap-1 text-muted-foreground/40">
            {Array.from({ length: max }).map((_, i) => (
               <StarFilled key={`bg-${i}`} size={size} />
            ))}
         </div>
         {/* 채움(노랑) — 각 별마다 부분 채움 */}
         <div className="absolute inset-0 flex gap-1 text-yellow-400">
            {Array.from({ length: max }).map((_, i) => {
               const fill = percentageFor(value, i); // 0~100
               return (
                  <div key={`fg-${i}`} className="relative" style={{ width: size, height: size }}>
                     <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                        <StarFilled size={size} />
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}

function percentageFor(value: number, starIndex: number) {
   // starIndex: 0-based
   const amount = clamp(value - starIndex, 0, 1);
   return amount * 100;
}

function clamp(n: number, min: number, max: number) {
   return Math.max(min, Math.min(max, n));
}

function StarFilled({ size = 20, className = "" }: { size?: number; className?: string }) {
   return (
      <svg
         width={size}
         height={size}
         viewBox="0 0 24 24"
         fill="currentColor"
         xmlns="http://www.w3.org/2000/svg"
         className={className}
      >
         <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.59 1.11 6.47L12 17.77l-5.8 3.05 1.11-6.47-4.7-4.59 6.49-.94L12 2.5z" />
      </svg>
   );
}

/* -------------------- 파생 컴포넌트(선택적으로 사용) -------------------- */
export function RatingDisplay(props: Omit<RatingProps, "onChange">) {
   return <Rating {...props} readOnly />;
}

export function RatingInput(props: Omit<RatingProps, "readOnly"> & { onChange: (v: number) => void }) {
   return <Rating {...props} />;
}
