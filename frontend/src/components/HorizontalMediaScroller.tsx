// 가로 스크롤 미리보기 뷰
import type { PostMedia } from "@/types/post";

export default function HorizontalMediaScroller({ media }: { media: PostMedia[] }) {
   return (
      <div className="flex gap-2 overflow-x-auto py-6 px-2">
         {media.map((m, idx) => (
            <div key={idx} className="relative flex-shrink-0 w-48 h-64">
               {m.type === "video" ? (
                  <video
                     src={m.url}
                     poster={m.poster}
                     className="w-full h-full object-cover rounded-lg"
                     controls
                  />
               ) : (
                  <img
                     src={m.url}
                     alt={`media-${idx}`}
                     className="w-full h-full object-cover rounded-lg"
                  />
               )}
            </div>
         ))}
      </div>
   );
}