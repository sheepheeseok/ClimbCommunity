import { Card, CardContent } from "@/components/ui/card"
import ProfileHeader from "../components/ProfileHeader"
import EditProfileDialog from "../components/EditProfileDialog"
import { useState } from "react"
import { useSocialModal } from "../hooks/useSocialModal"
import { useFollowCounts } from "../hooks/useFollowCounts"
import SocialModal from "@/components/follow/SocialModal"
import type { UserLite } from "@/components/follow/UserListItem"

type Props = {
   user: { id: string; name: string; levelLabel: string; bio?: string; canEdit?: boolean }
   followers: UserLite[]
   following: UserLite[]
}

export default function ProfileHeaderSection({ user, followers, following }: Props) {
   const [editOpen, setEditOpen] = useState(false)
   const social = useSocialModal("followers")
   const counts = useFollowCounts(followers.length, following.length)

   return (
      <>
         {/* 헤더: 프로필 + 팔로우/팔로잉 + 레벨 */}
         <Card className="border-none shadow-none">
            <CardContent className="py-2 px-4">
               <ProfileHeader
                  name={user.name}
                  levelLabel={user.levelLabel}
                  bio={user.bio}
                  canEdit={user.canEdit}
                  onEdit={() => setEditOpen(true)}
                  followerCount={counts.followerCount}
                  followingCount={counts.followingCount}
                  onOpenFollowers={social.openFollowers}
                  onOpenFollowing={social.openFollowing}
               />
            </CardContent>
         </Card>

         {/* 소셜 모달 */}
         <SocialModal
            open={social.open}
            defaultTab={social.tab}
            onOpenChange={social.setOpen}
            followers={followers}
            following={following}
            onCountChange={(delta) => counts.incFollowing(delta)}
         />

         <EditProfileDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            initialName={user.name}
            initialBio={user.bio}
            initialAvatarUrl={"서버 URL"}
            onSubmit={async ({ name, bio, avatarFile }) => {
               // 예시: FormData 전송
            }}
         />
      </>
   )
}