// 마이페이지 - 운동기록 썸네일 3:4 세로형
import { PostMedia } from "@/types/post";
import { format } from "date-fns"
import { CalendarIcon, MapPin } from "lucide-react"

type Props = {
  id: string;
  media: PostMedia[];          // 공용 타입
  createdAt?: string;
  location?: string;
  onClick: (id: string) => void;
};

export default function RecordThumbnail({
  id, media, createdAt, location, onClick
}: Props) {
  const placeholder = "https://picsum.photos/640/853?grayscale";
  const hero: PostMedia = media?.[0] ?? { type: "image", url: placeholder };

  const isVideo = hero.type === "video";
  const imgSrc = isVideo ? (hero.poster ?? placeholder) : hero.url;
  const vidSrc = isVideo ? hero.url : undefined;

  const prettyDate = createdAt ? format(new Date(createdAt), "yyyy.MM.dd") : null;
  const hasDate = !!prettyDate;
  const hasLocation = !!location;
  const showOverlay = hasDate || hasLocation;

  return (
    <button
      type="button"
      aria-label={`기록 보기${hasLocation ? `: ${location}` : ""}${hasDate ? ` · ${prettyDate}` : ""}`}
      onClick={() => onClick(id)}
      className="group relative aspect-[3/4] overflow-hidden rounded-md border bg-muted/40 p-0"
    >
      {isVideo ? (
        <video
          src={vidSrc}
          poster={imgSrc}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={imgSrc}
          alt={location || "thumbnail"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}

      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent">
          <div className="my-1 px-2 py-1 flex flex-col gap-1 items-start text-white text-[11px] md:text-xs">
            {hasDate && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{prettyDate}</span>
              </div>
            )}
            {hasLocation && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </button>
  );
}