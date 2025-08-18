import { z } from "zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import AvatarPicker from "./AvatarPicker"
import { useNicknameAvailability } from "../hooks/useNicknameAvailability"
import ComposerTextarea from "@/components/ComposerTextarea"

const schema = z.object({
   name: z.string().trim().min(2, "닉네임은 2자 이상").max(20, "닉네임은 20자 이하"),
   bio: z.string().trim().max(120, "상태 메시지는 120자 이하"),
})

export type ProfileEditValues = z.infer<typeof schema>

type Props = {
   defaultValues: { name: string; bio?: string; avatarUrl?: string }
   onCancel: () => void
   onSubmit: (payload: { name: string; bio: string; avatarFile: File | null }) => Promise<void> | void
}

export default function ProfileEditForm({ defaultValues, onCancel, onSubmit }: Props) {
   const { register, setValue, watch, handleSubmit, formState, trigger } =
      useForm<ProfileEditValues>({
         resolver: zodResolver(schema),
         defaultValues: { name: defaultValues.name, bio: defaultValues.bio || "" },
         mode: "onChange",
      })

   useEffect(() => { trigger() }, [trigger])

   // 닉네임 중복 확인 연동
   const nick = useNicknameAvailability(defaultValues.name)
   const nameValue = watch("name")
   const nameChanged = nameValue.trim() !== defaultValues.name.trim()
   useEffect(() => { nick.setValue(nameValue) }, [nameValue]) // 입력 → 중복 훅으로 전달

   // 아바타
   const [avatarFile, setAvatarFile] = useState<File | null>(null)
   const [preview, setPreview] = useState<string | undefined>(defaultValues.avatarUrl)
   function handleAvatar(file: File | null, url?: string) { setAvatarFile(file); setPreview(url) }

   const canSave =
      formState.isValid &&
      (!nameChanged || nick.status === "available")

   return (
      <form
         className="p-0"
         onSubmit={handleSubmit(async (values) => {
            await onSubmit({ name: values.name.trim(), bio: values.bio.trim(), avatarFile })
         })}
      >
         {/* 헤더 액션 바 */}
         <div className="py-1 flex items-center justify-between border-b">
            <Button type="button" variant="ghost" className="bg-transparent text-gray-600 font-bold" onClick={onCancel}>취소</Button>
            <div className="text-sm font-bold">프로필 편집</div>
            <Button type="submit" variant="ghost" className="bg-transparent text-blue-600 font-bold" disabled={!canSave || (nameChanged && nick.status === "checking")}>
               {nick.status === "checking" ? "확인 중..." : "저장"}
            </Button>
         </div>

         <div className="flex gap-6 p-4">
            {/* 아바타 */}
            <AvatarPicker
               previewUrl={preview}
               fallback={nameValue.at(0) ?? "U"}
               onFileSelected={handleAvatar}
            />

            {/* 2행 폼 */}
            <div className="flex flex-col flex-1 gap-4">
               <div className="flex flex-col gap-2">
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input id="nickname" {...register("name")} placeholder="닉네임을 입력하세요" />
                  <p className={
                     "text-xs " +
                     (nick.status === "unavailable" ? "text-red-600"
                        : nick.status === "available" && nameValue.trim() !== defaultValues.name.trim()
                           ? "text-emerald-600" : "text-muted-foreground")
                  }>
                     {formState.errors.name?.message ||
                        (nick.status === "checking" ? "중복 확인 중..." :
                           nick.status === "available" && nameValue.trim() !== defaultValues.name.trim()
                              ? "사용 가능한 닉네임입니다." : "")}
                  </p>
               </div>

               <div className="flex flex-col gap-2">
                  <Label htmlFor="bio">상태 메시지</Label>
                  <ComposerTextarea
                     value={watch("bio")}
                     onChange={(v) => setValue("bio", v, { shouldValidate: true })}
                     maxLength={120}
                     placeholder="한 줄 소개를 입력하세요"
                  />
                  {formState.errors.bio && (
                     <p className="text-xs text-red-600">{formState.errors.bio.message}</p>
                  )}
               </div>
            </div>
         </div>
      </form>
   )
}