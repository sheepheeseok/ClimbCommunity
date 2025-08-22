import HorizontalMediaScroller from "@/components/HorizontalMediaScroller"
import PostHeader from "./PostHeader"
import PostMetaChips from "./PostMetaChips"
import PostBody from "./PostBody"
import { usePostOwnership } from "../hooks/usePostOwnership"
import type { Author } from "@/types/author"
import type { PostMedia } from "@/types/post"
import HoldsSummary from "./HoldsSummary"
import CommentsList from "@/components/comments/CommentsList"
import { PostComment } from "@/types/comment"

type Props = {
   postId: string
   media: PostMedia[]
   author: Author
   text?: string
   attemptsByGrade: number[]
   clearsByGrade: number[]
   createdAt?: string
   location?: string
   currentUserId?: string | null
   isFollowing?: boolean
   followPending?: boolean
   onToggleFollow?: (authorId: string, next: boolean) => void
   comments?: PostComment[]
}

export default function PostModal(props: Props) {
   const { author, currentUserId, isFollowing, followPending, onToggleFollow,
      media, text, attemptsByGrade, clearsByGrade, createdAt, location, comments=[] } = props
   const { isMine, showFollowButton } = usePostOwnership(currentUserId ?? null, author)

   return (
      <div className="w-[min(960px)] bg-background rounded-xl overflow-hidden">
         <div className="grid h-full lg:grid-cols-[3fr_1fr]">
            <div className="relative flex flex-col overflow-hidden px-3">
               <PostHeader
                  author={author}
                  isMine={isMine}
                  showFollowButton={showFollowButton}
                  isFollowing={!!isFollowing}
                  followPending={followPending}
                  onToggleFollow={onToggleFollow}
               />

               <div className="flex-1 overflow-hidden">
                  <HorizontalMediaScroller media={media} />
               </div>

               <PostBody text={text} />

               {/* 하단: 좌(요약) / 우(메타) */}
               <div className="px-3 py-3 border-t">
                  <div className="grid gap-4 md:grid-cols-2 items-start">
                     <HoldsSummary attemptsByGrade={attemptsByGrade} clearsByGrade={clearsByGrade} />
                     <PostMetaChips createdAt={createdAt} location={location} />
                  </div>
               </div>
            </div>

            <aside className="hidden lg:flex flex-col border-l">
               <div className="px-3 py-2 border-b text-sm font-medium">댓글</div>
               <div className="flex-1 overflow-auto">
                  <CommentsList items={comments} />
               </div>
               {/* (후에) 입력창 영역 자리
          <div className="border-t p-2">...</div>
          */}
            </aside>
         </div>
      </div>
   )
}
