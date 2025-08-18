import { useEffect, useState } from "react"
import type { UserLite } from "./UserListItem"
import SocialList from "./SocialList"

export default function SocialListContainer({
  initialUsers,
  onCountChange, // 팔로워/팔로잉 카운트 증감 필요 시
}: {
  initialUsers: UserLite[]
  onCountChange?: (delta: 1 | -1) => void
}) {
  const [users, setUsers] = useState<UserLite[]>(initialUsers)
  const [pendingId, setPendingId] = useState<string | null>(null)

  // 부모가 새 데이터를 주면 동기화
  useEffect(() => { setUsers(initialUsers) }, [initialUsers])

  const handleToggle = async (userId: string, next: boolean) => {
    // 낙관적 업데이트
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isFollowing: next } : u))
    onCountChange?.(next ? 1 : -1)
    setPendingId(userId)
    try {
      // TODO: await api.toggleFollow(userId, next)
    } catch {
      // 롤백
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isFollowing: !next } : u))
      onCountChange?.(next ? -1 : 1)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <SocialList users={users} pendingId={pendingId} onToggle={handleToggle} />
  )
}