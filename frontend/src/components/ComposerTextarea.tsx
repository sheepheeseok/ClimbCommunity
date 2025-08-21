// Textarea
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useRef } from "react"
import clsx from "clsx"

type Props = {
   value: string
   onChange: (v: string) => void
   maxLength?: number
   placeholder?: string
   rows?: number
   className?: string
}

export default function ComposerTextarea({
   value, onChange, maxLength = 120, placeholder, rows = 3, className,
}: Props) {
   const ref = useRef<HTMLTextAreaElement>(null)

   const count = value.length
   const over = count > maxLength

   return (
      <div className={clsx("relative", className)}>
         <Textarea
            ref={ref}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-24 resize-none pr-12 overflow-y-auto leading-5"
         />
         <span className={clsx(
            "pointer-events-none absolute bottom-2 right-2 text-xs",
            over ? "text-red-600" : "text-muted-foreground"
         )}>
            {count}/{maxLength}
         </span>
      </div>
   )
}
