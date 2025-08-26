import { useCallback, useEffect, useState } from "react";
import type { UserLite } from "./UserListItem";
import SocialList from "./SocialList";
import { useMyPageData } from "@/pages/my_tap/data/useMyPageData";

type Props = {
  /** 보여줄 목록 */
  source: "followers" | "following";
  /** 팔로잉 수 증감 반영 */
  onCountChange?: (delta: 1 | -1) => void;
};

export default function SocialListContainer({ source, onCountChange }: Props) {
  const { data, ready } = useMyPageData();

  // 베이스 목록 (ready=false여도 빈 배열 보장)
  const base = (source === "followers" ? data.followers : data.following) as UserLite[];

  // 내부 상태: 최초 마운트 시에만 base로 초기화
  const [users, setUsers] = useState<UserLite[] | null>(ready ? base : null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // H1 시드가 준비되면 1회 초기화 (부모에서 key={tab}로 탭 전환 시 컴포넌트가 리마운트됨)
  useEffect(() => {
    if (!ready) return;
    setUsers(base);
  }, [ready, base]);

  const handleToggle = useCallback(async (userId: string, next: boolean) => {
    // 낙관적 업데이트 (users가 null이어도 안전하게 no-op)
    setUsers(prev =>
      prev ? prev.map(u => (u.id === userId ? { ...u, isFollowing: next } : u)) : prev
    );
    onCountChange?.(next ? 1 : -1);

    setPendingId(userId);
    try {
      // TODO: await api.toggleFollow(userId, next)
    } catch {
      // 실패 시 롤백
      setUsers(prev =>
        prev ? prev.map(u => (u.id === userId ? { ...u, isFollowing: !next } : u)) : prev
      );
      onCountChange?.(next ? -1 : 1);
    } finally {
      setPendingId(null);
    }
  }, [onCountChange]);

  if (!ready || !users) {
    return <div className="h-40 rounded bg-muted animate-pulse" />;
  }

  return <SocialList users={users} pendingId={pendingId} onToggle={handleToggle} />;
}
