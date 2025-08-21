// 팔로우/팔로잉 목록을 보여주는 모달
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UnderlineTabs, UnderlineTabsContent } from "@/components/UnderlineTabs"
import type { UserLite } from "./UserListItem"
import SocialListContainer from "./SocialListContainer"

type Props = {
  open: boolean
  defaultTab?: "followers" | "following"
  onOpenChange: (v: boolean) => void
  followers: UserLite[]
  following: UserLite[]
  onCountChange?: (delta: 1 | -1) => void
}

export default function SocialModal({
  open, defaultTab = "followers", onOpenChange, followers, following, onCountChange
}: Props) {
  const [tab, setTab] = useState<"followers" | "following">(defaultTab)
  useEffect(() => { if (open) setTab(defaultTab) }, [open, defaultTab])

  const list = tab === "followers" ? followers : following

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-md p-0 overflow-hidden gap-0">

        {/* 스크린 리더용 제목 + 설명 */}
        <DialogTitle className="sr-only">팔로우/팔로잉 목록</DialogTitle>
        <DialogDescription className="sr-only">
          팔로우/팔로잉 목록을 보여주는 모달입니다.
        </DialogDescription>

        <DialogHeader className="sticky top-0 z-10 bg-background p-0">
          <UnderlineTabs
            items={[{ value: "followers", label: "팔로워" }, { value: "following", label: "팔로잉" }]}
            value={tab}
            onValueChange={(v) => setTab(v as any)}
            equalWidth
            layoutId="underline-modal"
            className="w-full"
          >
            <UnderlineTabsContent value="followers" />
            <UnderlineTabsContent value="following" />
          </UnderlineTabs>
        </DialogHeader>

        <ScrollArea className="h-auto">
          <SocialListContainer
            key={tab} // 탭 바뀔 때 내부 상태 초기화
            initialUsers={list}
            onCountChange={onCountChange}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}