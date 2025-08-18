// 시도/완등 집계 + 퍼센트/색

export function useWorkoutSummary(attemptsByGrade: number[], clearsByGrade: number[]) {
   // 시도/완등 총 문제수
   const totalAttempts = attemptsByGrade.reduce((a, b) => a + b, 0)
   const totalClears = clearsByGrade.reduce((a, b) => a + b, 0)

   // 완등률
   const percent = totalAttempts ? Math.round((totalClears / totalAttempts) * 100) : 0
   const barClass = percent >= 80 ? "bg-emerald-600" : percent >= 50 ? "bg-foreground/80" : "bg-amber-600"

   // 문제 데이터 유무 체크
   const hasData = totalAttempts > 0 || totalClears > 0
   return { totalAttempts, totalClears, percent, barClass, hasData }
}