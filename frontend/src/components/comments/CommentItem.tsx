import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format, formatDistanceToNowStrict } from "date-fns"
import { ko } from "date-fns/locale"
import type { PostComment } from "@/types/comment"

type Props = {
   comment: PostComment
   // 옵션들 (필요시 확장)
   compact?: boolean               // 여백을 조금 줄여서 렌더
}

export default function CommentItem({ comment, compact = false }: Props) {
   const d = new Date(comment.createdAt)
   const timeAgo = isNaN(d.getTime())
      ? ""
      : formatDistanceToNowStrict(d, { addSuffix: true, locale: ko })
   const fullTime = isNaN(d.getTime()) ? "" : format(d, "yyyy.MM.dd HH:mm", { locale: ko })

   return (
      <div className={`flex gap-3 ${compact ? "py-2" : "py-3"}`}>
         <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.nickname} />
            <AvatarFallback>{initials(comment.author.nickname)}</AvatarFallback>
         </Avatar>

         <div className="min-w-0 flex-1">
            {/* 헤더: 닉네임 · 레벨 · 시각 */}
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
               <span className="font-medium text-foreground">{comment.author.nickname}</span>
               {comment.author.level && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                     {comment.author.level}
                  </Badge>
               )}
               {timeAgo && (
                  <>
                     <span className="opacity-50">•</span>
                     <time title={fullTime} dateTime={comment.createdAt}>
                        {timeAgo}
                     </time>
                  </>
               )}
            </div>

            {/* 본문 */}
            <div className="mt-1 text-sm whitespace-pre-line break-words">
               {comment.content}
            </div>
         </div>
      </div>
   )
}

function initials(name: string) {
   const p = name.trim().split(/\s+/)
   return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase()
}