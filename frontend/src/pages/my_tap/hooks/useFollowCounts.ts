// pages/MyPage/hooks/useFollowCounts.ts
import { useState } from "react"

export function useFollowCounts(
  initialFollowers: number,
  initialFollowing: number
) {
  const [followerCount, setFollowerCount] = useState(initialFollowers)
  const [followingCount, setFollowingCount] = useState(initialFollowing)

  // 버튼 토글로는 팔로잉 목록의 숫자만 변경됨
  const incFollowing = (delta: 1 | -1) => {
    setFollowingCount(c => c + delta)
  }

  // 팔로워 수는 외부 이벤트(서버 푸시/리패치)로만 갱신
  const syncFollowers = (nextCount: number) => {
    setFollowerCount(nextCount)
  }

  return { followerCount, followingCount, incFollowing, syncFollowers, setFollowerCount: syncFollowers }
}
