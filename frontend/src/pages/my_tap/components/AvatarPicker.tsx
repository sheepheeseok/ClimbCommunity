// 아바타 이미지 선택 컴포넌트
import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type Props = {
  previewUrl?: string
  fallback: string
  onFileSelected: (file: File | null, previewUrl?: string) => void
}

export default function AvatarPicker({ previewUrl, fallback, onFileSelected }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function pick() { fileRef.current?.click() }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    if (f) onFileSelected(f, URL.createObjectURL(f))
    else onFileSelected(null, previewUrl)
  }

  return (
    <div className="relative h-fit">
      <Avatar className="h-24 w-24">
        <AvatarImage src={previewUrl} alt="avatar" />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <Button type="button" variant="default" size="sm"
        className="absolute -bottom-2 -right-2 h-7 px-2 bg-black text-xs text-white font-bold"
        onClick={pick}>
        변경
      </Button>
    </div>
  )
}