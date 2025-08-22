import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"

export default function PostMetaChips({ createdAt, location }: { createdAt?: string; location?: string }) {
  const prettyDate = createdAt ? format(new Date(createdAt), "yyyy.MM.dd") : null
  const hasMeta = !!prettyDate || !!location
  if (!hasMeta) return null
  return (
    <div className="flex flex-col space-y-2 md:justify-self-end">
      {prettyDate && (
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
          <CalendarIcon className="h-4 w-4" />
          <span>{prettyDate}</span>
        </div>
      )}
      {location && (
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
          <MapPin className="h-4 w-4" />
          <span className="truncate max-w-[220px]">{location}</span>
        </div>
      )}
    </div>
  )
}
