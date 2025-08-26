import { Card, CardContent } from "@/components/ui/card";
import ProfileHeader from "../components/ProfileHeader";
import EditProfileDialog from "../components/EditProfileDialog";
import { useState } from "react";
import { useSocialModal } from "../hooks/useSocialModal";
import { useFollowCounts } from "../hooks/useFollowCounts";
import SocialModal from "@/components/follow/SocialModal";
import { useMyPageData } from "../data/useMyPageData";

export default function ProfileHeaderSection() {
   // 항상 호출: 훅 순서 고정
   const { data, ready } = useMyPageData();
   const { user, followers, following } = data;

   //  UI 상태 훅들
   const [editOpen, setEditOpen] = useState(false);
   const social = useSocialModal("followers");
   const counts = useFollowCounts(followers.length, following.length);

   return (
      <>
         <Card className="border-none shadow-none">
            <CardContent className="py-2 px-4">
               {!ready ? (
                  <div className="h-20 rounded bg-muted animate-pulse" />
               ) : (
                  <ProfileHeader
                     name={user.name ?? ""}
                     levelLabel={user.levelLabel ?? ""}
                     bio={user.bio ?? ""}
                     canEdit={!!user.canEdit}
                     onEdit={() => setEditOpen(true)}
                     followerCount={counts.followerCount}
                     followingCount={counts.followingCount}
                     onOpenFollowers={social.openFollowers}
                     onOpenFollowing={social.openFollowing}
                  />
               )}
            </CardContent>
         </Card>

         {/* 데이터 준비된 뒤에만 모달 표시(선택) */}
         {ready && (
            <SocialModal
               open={social.open}
               defaultTab={social.tab}
               onOpenChange={social.setOpen}
               onCountChange={(delta) => counts.incFollowing(delta)}
            />
         )}

         <EditProfileDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            initialName={user.name ?? ""}
            initialBio={user.bio ?? ""}
            initialAvatarUrl={(user as any).avatarUrl ?? (user as any).avatar ?? ""}
            onSubmit={async ({ name, bio, avatarFile }) => {
               // 여기에 API 연동 시 FormData 전송
            }}
         />
      </>
   );
}
