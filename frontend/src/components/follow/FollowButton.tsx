import { Button } from "@/components/ui/button"

type Props = {
  isFollowing: boolean
  pending?: boolean
  onToggle: (next: boolean) => void   // 클릭 시 다음 상태를 부모에 보고
}

export default function FollowButton({ isFollowing, pending, onToggle }: Props) {
  return (
    <Button
      size="sm"
      variant={isFollowing ? "secondary" : "default"}
      onClick={() => onToggle(!isFollowing)}
      disabled={pending}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
    </Button>
  )
}
