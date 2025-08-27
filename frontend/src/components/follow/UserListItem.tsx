import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "./FollowButton";
import { useMyPageData } from "@/pages/my_tap/data/useMyPageData";
import { useCallback, useEffect, useMemo, useState } from "react";

export type UserLite = { id: string; name: string; avatar?: string; isFollowing?: boolean };

type Props = {
  userId: string;
  onToggle?: (userId: string, next: boolean) => void;
};

export default function UserListItem({ userId, onToggle }: Props) {
  const { data, ready } = useMyPageData();

  // followers / following 가져오기
  const user: UserLite | undefined = useMemo(() => {
    return (
      data.followers.find((u) => u.id === userId) ??
      data.following.find((u) => u.id === userId)
    );
  }, [data.followers, data.following, userId]);

  // 로컬 상태 (초기값은 안전하게 false)
  const [isFollowing, setIsFollowing] = useState<boolean>(!!user?.isFollowing);
  const [pending, setPending] = useState<boolean>(false);

  // 로딩 후 user가 들어오면 isFollowing을 동기화
  useEffect(() => {
    setIsFollowing(!!user?.isFollowing);
  }, [user?.isFollowing]);

  const handleToggle = useCallback(
    async (next: boolean) => {
      setPending(true);
      try {
        // 낙관적 업데이트
        setIsFollowing(next);
        onToggle?.(userId, next);
        // await api.toggleFollow(userId, next) 추가
      } finally {
        setPending(false);
      }
    },
    [onToggle, userId]
  );

  const firstChar = user?.name?.[0] ?? "?";

  // 아직 시드 준비 전 스켈레톤
  if (!ready) {
    return <li className="h-12 rounded bg-muted animate-pulse" />;
  }

  // 시드와 리스트가 불일치할 때 안전 가드
  if (!user) return null;

  return (
    <li className="flex items-center justify-between rounded-md px-4 py-2 hover:bg-muted/60">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{firstChar}</AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <div className="font-medium">{user.name ?? ""}</div>
        </div>
      </div>

      <FollowButton
        isFollowing={isFollowing}
        pending={pending}
        onToggle={handleToggle}
      />
    </li>
  );
}
