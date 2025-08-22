import { useMemo } from "react"
import type { Author } from "@/types/author"

export function usePostOwnership(currentUserId: string | null | undefined, author: Author) {
   return useMemo(() => {
      const isMine = !!currentUserId && currentUserId === author.id
      const showFollowButton = !!currentUserId && !isMine
      return { isMine, showFollowButton }
   }, [currentUserId, author.id])
}