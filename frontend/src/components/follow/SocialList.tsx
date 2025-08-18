// 팔로우/팔로잉 목록 컴포넌트

import UserListItem, { UserLite } from "@/components/follow/UserListItem"

type Props = {
  users: UserLite[]
  pendingId?: string | null
  onToggle: (userId: string, next: boolean) => void
}

export default function SocialList({ users, pendingId, onToggle }: Props) {
  if (!users?.length) {
    return <div className="py-14 text-center text-sm text-muted-foreground">목록이 없어요.</div>
  }
  return (
    <ul className="p-0 pb-2 space-y-0">
      {users.map(u => (
        <UserListItem
          key={u.id}
          user={u}
          pending={pendingId === u.id}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}