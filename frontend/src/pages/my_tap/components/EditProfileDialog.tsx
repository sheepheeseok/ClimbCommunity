// 프로필 편집 다이얼로그
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import ProfileEditForm, { ProfileEditValues } from "./ProfileEditForm"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialName: string
  initialBio?: string
  initialAvatarUrl?: string
  onSubmit: (payload: { name: string; bio: string; avatarFile: File | null }) => Promise<void> | void
}

export default function EditProfileDialog({
  open, onOpenChange, initialName, initialBio = "", initialAvatarUrl, onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden [&>button]:hidden">
        {/* 스크린 리더용 제목 + 설명 */}
        <DialogTitle className="sr-only">프로필 편집</DialogTitle>
        <DialogDescription className="sr-only">
          닉네임, 프로필 이미지, bio 등의 편집 위한 모달입니다.
        </DialogDescription>
        <ProfileEditForm
          defaultValues={{ name: initialName, bio: initialBio, avatarUrl: initialAvatarUrl }}
          onCancel={() => onOpenChange(false)}
          onSubmit={async (payload) => {
            await onSubmit(payload)  // FormData 업로드는 부모에서 처리
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
