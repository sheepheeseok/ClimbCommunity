import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWorkoutSummary } from "../hooks/useWorkoutSummary";
import HoldCountDisplay from "../components/HoldCountDisplay";
import { useMyPageData } from "../data/useMyPageData";
import { useUploadModalOpen } from "@/stores/useUploadModalOpen";

export default function WorkoutSummarySection() {
   // 항상 호출: 훅 순서 고정
   const { data, ready } = useMyPageData();
   const { setOpen } = useUploadModalOpen();

   // 시드 값(빈 기본값 보장)
   const { attemptsByGrade, clearsByGrade } = data;

   // 항상 호출 (ready=false여도 [0,0,...]로 안전)
   const { totalAttempts, totalClears, percent, barClass, hasData } =
      useWorkoutSummary(attemptsByGrade, clearsByGrade);

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-base">운동 기록 요약</CardTitle>
         </CardHeader>

         <CardContent className="pt-0">
            {!ready ? (
               // ⏳ 로딩 스켈레톤 (데이터 주입 전)
               <div className="h-24 rounded-lg bg-muted animate-pulse" />
            ) : hasData ? (
               <>
                  {/* KPI 줄: 시도 ↔ 진행률 ↔ 완등 */}
                  <div className="flex items-center justify-between gap-4">
                     <Metric label="시도" value={totalAttempts} />
                     <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                           <span>완등률</span>
                           <span>{percent}%</span>
                        </div>
                        <div className="relative">
                           <Progress value={percent} className="h-2 bg-muted  [&>div]:bg-transparent" />
                           <div
                              className={`absolute left-0 top-0 h-2 rounded ${barClass}`}
                              style={{ width: `${percent}%` }}
                           />
                        </div>
                     </div>
                     <Metric label="완등" value={totalClears} />
                  </div>

                  {/* 레벨별 정보 */}
                  <div className="mt-4 space-y-2">
                     <Row label="시도 문제 정보">
                        <HoldCountDisplay
                           counts={attemptsByGrade}
                           variant="chips"
                           hideZero
                           size="sm"
                           className="mt-0"
                        />
                     </Row>
                     <Row label="완등 문제 정보">
                        <HoldCountDisplay
                           counts={clearsByGrade}
                           variant="chips"
                           hideZero
                           size="sm"
                           className="mt-0"
                        />
                     </Row>
                  </div>
               </>
            ) : (
               /* Empty State : 운동 기록 하나도 없을 때 */
               <div className="rounded-lg text-center">
                  <h3 className="text-sm font-medium">아직 운동 기록이 없어요</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                     운동기록 게시물을 업로드하면 요약이 여기에 표시됩니다.
                  </p>
                  <button
                     className="mt-4 inline-flex h-9 items-center rounded-md bg-foreground px-3 text-sm text-background"
                     onClick={() => setOpen(true)}
                  >
                     기록하러 가기
                  </button>
               </div>
            )}
         </CardContent>
      </Card>
   );
}

function Metric({ label, value }: { label: string; value: number }) {
   return (
      <div className="flex items-baseline gap-2">
         <span className="text-sm text-muted-foreground">{label}</span>
         <span className="text-3xl font-semibold tabular-nums">{value.toLocaleString()}</span>
      </div>
   );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <div className="grid grid-cols-[88px,1fr] items-start gap-x-3">
         <span className="text-left text-xs leading-7 text-muted-foreground">{label}</span>
         {children}
      </div>
   );
}
