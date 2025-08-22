import HorizontalMediaScroller from "@/components/HorizontalMediaScroller";
import PostBody from "@/pages/my_tap/components/PostBody";
import PostHeader from "@/pages/my_tap/components/PostHeader";
import PostMetaChips from "@/pages/my_tap/components/PostMetaChips";
import { usePostOwnership } from "@/pages/my_tap/hooks/usePostOwnership";
import type { Author } from "@/types/author";
import type { PostMedia } from "@/types/post";

export type PostBaseProps = {
   postId: string;
   media: PostMedia[];
   author: Author;
   text?: string;
   attemptsByGrade: number[];
   clearsByGrade: number[];
   createdAt?: string;
   location?: string;
   currentUserId?: string | null;
   isFollowing?: boolean;
   followPending?: boolean;
   onToggleFollow?: (authorId: string, next: boolean) => void;
};

export default function PostContent(props: PostBaseProps) {
   const {
      author,
      currentUserId,
      isFollowing,
      followPending,
      onToggleFollow,
      media,
      text,
      attemptsByGrade,
      clearsByGrade,
      createdAt,
      location,
   } = props;

   const { isMine, showFollowButton } = usePostOwnership(currentUserId ?? null, author);

   return (
      <div className="relative flex flex-col overflow-hidden px-3">
         <PostHeader
            author={author}
            isMine={isMine}
            showFollowButton={showFollowButton}
            isFollowing={!!isFollowing}
            followPending={followPending}
            onToggleFollow={onToggleFollow}
         />

         <div className="flex-1 overflow-hidden">
            <HorizontalMediaScroller media={media} />
         </div>

         <PostBody text={text} />

      </div>
   );
}