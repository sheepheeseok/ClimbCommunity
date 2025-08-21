import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Check } from "lucide-react"
import HorizontalMediaScroller from "@/components/HorizontalMediaScroller"
import { Author } from "@/types/author"
import { PostMedia } from "@/types/post"

type Props = {
   postId: string;
   media: PostMedia[];                 // ✅ 단일 배열
   author: Author;                     // ✅ 분리된 타입
   currentUserId?: string | null;      // 비로그인 허용
   isFollowing?: boolean;
   onToggleFollow?: (authorId: string) => void;
};

export default function PostModal({
   postId,
   media,
   author,
   currentUserId = null,
   isFollowing = false,
   onToggleFollow,
}: Props) {
   const isMine = !!currentUserId && currentUserId === author.id;

   return (
      <div className="h-[min(86vh,820px)] w-[min(96vw,1100px)] bg-background rounded-xl overflow-hidden">
         <div className="grid h-full lg:grid-cols-[3fr_1fr]">
            {/* 좌측: 헤더 + 미디어 */}
            <div className="relative flex flex-col">
               <Header
                  author={author}
                  isMine={isMine}
                  showFollowButton={!!currentUserId && !isMine}
                  isFollowing={isFollowing}
                  onToggleFollow={onToggleFollow}
               />

               <div className="flex-1 overflow-hidden">
                  <HorizontalMediaScroller media={media} />
               </div>
            </div>

            {/* 우측: 댓글 패널(자리만) */}
            <aside className="hidden lg:block border-l">
               <div className="h-full grid place-items-center text-sm text-muted-foreground">
                  (댓글 영역)
               </div>
            </aside>
         </div>
      </div>
   );
}







function Header({
   author,
   isMine,
   showFollowButton,
   isFollowing,
   onToggleFollow,
}: {
   author: Author;
   isMine: boolean;
   showFollowButton: boolean;
   isFollowing: boolean;
   onToggleFollow?: (authorId: string) => void;
}) {
   return (
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-2">
         <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatarUrl} alt={author.nickname} />
            <AvatarFallback>{initials(author.nickname)}</AvatarFallback>
         </Avatar>

         <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <span className="font-medium truncate">{author.nickname}</span>
               {author.level && (
                  <Badge variant="secondary" className="text-[10px] leading-none">
                     {author.level}
                  </Badge>
               )}
            </div>
         </div>

         {/* 비로그인/본인 글이면 숨김 */}
         {showFollowButton && !isMine && (
            <Button
               size="sm"
               variant={isFollowing ? "secondary" : "default"}
               className="gap-1"
               onClick={() => onToggleFollow?.(author.id)}
               aria-pressed={isFollowing}
               aria-label={isFollowing ? "언팔로우" : "팔로우"}
            >
               {isFollowing ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
               {isFollowing ? "팔로잉" : "팔로우"}
            </Button>
         )}
      </div>
   );
}

function initials(name: string) {
   const parts = name.trim().split(/\s+/);
   const first = parts[0]?.[0] ?? "";
   const last = parts[1]?.[0] ?? "";
   return (first + last).toUpperCase();
}