import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FollowButton from "./FollowButton";


export type UserLite = { id: string; name: string; avatar?: string; isFollowing?: boolean }

type Props = {
  user: UserLite
  pending?: boolean
  onToggle: (userId: string, next: boolean) => void
}

export default function UserListItem({ user, pending, onToggle }: Props) {
  return (
    <li className="flex items-center justify-between rounded-md px-4 py-2 hover:bg-muted/60">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.at(0)}</AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <div className="font-medium">{user.name}</div>
        </div>
      </div>

      <FollowButton
        isFollowing={!!user.isFollowing}
        pending={pending}
        onToggle={(next) => onToggle(user.id, next)}  // ← 아이디와 함께 위로 전달
      />
    </li>
  )
}