// 팔로우/팔로잉 소셜 모달(open/tab) 제어

import { useState } from "react"

export type SocialTab = "followers" | "following"

export function useSocialModal(initialTab: SocialTab = "followers") {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<SocialTab>(initialTab)

  const openFollowers = () => { setTab("followers"); setOpen(true) }
  const openFollowing = () => { setTab("following"); setOpen(true) }

  return { open, setOpen, tab, setTab, openFollowers, openFollowing }
}
