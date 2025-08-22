// 난이도별 시도/완등(칩 UI). 배열 검사와 표시

import HoldCountDisplay from "./HoldCountDisplay"

export default function HoldsSummary({
   attemptsByGrade, clearsByGrade,
}: { attemptsByGrade: number[]; clearsByGrade: number[] }) {
   const hasAttempts = attemptsByGrade?.some(n => (n ?? 0) > 0)
   const hasClears = clearsByGrade?.some(n => (n ?? 0) > 0)
   if (!hasAttempts && !hasClears) return null
   return (
      <div className="space-y-3">
         {hasAttempts && (
            <div>
               <div className="mb-1 text-xs text-muted-foreground">시도 문제수</div>
               <HoldCountDisplay counts={attemptsByGrade} variant="chips" hideZero size="sm" />
            </div>
         )}
         {hasClears && (
            <div>
               <div className="mb-1 text-xs text-muted-foreground">완등 문제수</div>
               <HoldCountDisplay counts={clearsByGrade} variant="chips" hideZero size="sm" />
            </div>
         )}
      </div>
   )
}