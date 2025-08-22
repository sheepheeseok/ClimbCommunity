export default function PostBody({ text }: { text?: string }) {
   if (!text) return null
   return <div className="px-3 py-3 text-sm text-foreground whitespace-pre-line text-left">{text}</div>
}