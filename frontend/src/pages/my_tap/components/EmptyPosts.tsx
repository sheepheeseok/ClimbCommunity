import { ImagePlus } from "lucide-react"

export default function EmptyPosts({
  message = "아직 업로드된 운동 기록이 없어요.",
  hint = "첫 기록을 업로드하고 순간을 남겨보세요!",
  cta,
}: {
  message?: string
  hint?: string
  cta?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="rounded-full border p-4 text-muted-foreground">
        <ImagePlus className="h-6 w-6" />
      </div>
      <p className="mt-1 text-sm font-medium">{message}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      {cta ? <div className="mt-3">{cta}</div> : null}
    </div>
  )
}
