import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import FollowButton from "@/components/follow/FollowButton"
import type { Author } from "@/types/author"

type Props = {
  author: Author
  isMine: boolean
  showFollowButton: boolean
  isFollowing: boolean
  followPending?: boolean
  onToggleFollow?: (authorId: string, next: boolean) => void
}
export default function PostHeader({ author, isMine, showFollowButton, isFollowing, followPending, onToggleFollow }: Props) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 py-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={author.avatarUrl} alt={author.nickname} />
        <AvatarFallback>{(author.nickname?.slice(0,2) || "").toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{author.nickname}</span>
          {author.level && <Badge variant="secondary">{author.level}</Badge>}
        </div>
      </div>
      {showFollowButton && !isMine && (
        <FollowButton
          isFollowing={isFollowing}
          pending={followPending}
          onToggle={(next) => onToggleFollow?.(author.id, next)}
        />
      )}
    </div>
  )
}