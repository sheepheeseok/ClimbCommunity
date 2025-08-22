import type { PostComment } from "@/types/comment"
import CommentItem from "./CommentItem"

type Props = {
   items: PostComment[]
   emptyText?: string
}

export default function CommentsList({ items, emptyText = "아직 댓글이 없습니다." }: Props) {
   if (!items?.length) {
      return <p className="px-3 py-6 text-sm text-muted-foreground">{emptyText}</p>
   }
   return (
      <div className="divide-y">
         {items.map(c => (
            <div key={c.id} className="px-3">
               <CommentItem comment={c} />
            </div>
         ))}
      </div>
   )
}