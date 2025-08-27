import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"  // 편집 아이콘

type Props = {
   name?: string
   levelLabel?: string
   bio?: string
   followerCount: number
   followingCount: number
   canEdit?: boolean
   onEdit?: () => void
   onOpenFollowers: () => void
   onOpenFollowing: () => void
}

export default function ProfileHeader({
   name = "", levelLabel = "", bio = "", followerCount, followingCount, canEdit, onEdit,
   onOpenFollowers, onOpenFollowing,
}: Props) {
   const firstChar = (name?.[0] ?? "?");
   return (
      <div className="flex items-start gap-8">
         <Avatar className="h-24 w-24">
            <AvatarImage src="" alt="profile" />
            <AvatarFallback>{name.at(0)}</AvatarFallback>
         </Avatar>

         <div className="flex-1">
            {/* 닉네임, 레벨, 편집 아이콘 */}
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-semibold">{name}</h1>
               <Badge variant="secondary">{levelLabel}</Badge>
               {canEdit && (
                  <Button variant="ghost" size="icon" className="h-8 w-7 bg-gray-100" onClick={onEdit}>
                     <Pencil className="h-4 w-4" />
                  </Button>
               )}
            </div>

            {/* 팔로워/팔로잉 → 같은 모달, 다른 기본 탭 */}
            <div className="mt-3 flex gap-4 text-sm">
               <Button variant="ghost" size="sm" className="p-0 bg-transparent hover:bg-transparent hover:border-none text-gray-700" onClick={onOpenFollowers}>
                  팔로워 {followerCount}
               </Button>
               <Button variant="ghost" size="sm" className="p-0 bg-transparent hover:bg-transparent hover:border-none text-gray-700" onClick={onOpenFollowing}>
                  팔로잉 {followingCount}
               </Button>
            </div>

            {/* bio (선택적) */}
            {bio && <p className="mt-3 text-left text-sm text-muted-foreground">{bio}</p>}
         </div>
      </div>
   )
}