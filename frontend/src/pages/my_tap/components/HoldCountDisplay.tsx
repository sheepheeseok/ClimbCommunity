import { HoldIconLv1, HoldIconLv2, HoldIconLv3, HoldIconLv4, HoldIconLv5, HoldIconLv6, HoldIconLv7 } from "@/components/icons/index";

const holdIcons = [HoldIconLv1, HoldIconLv2, HoldIconLv3, HoldIconLv4, HoldIconLv5, HoldIconLv6, HoldIconLv7];

interface HoldCountDisplayProps {
   counts: number[];             // 레벨별 개수 (length 7)
   className?: string;
   variant?: "inline" | "chips"; // 표시 방식
   hideZero?: boolean;           // 0은 숨길지
   size?: "sm" | "md";           // 아이콘/텍스트 크기
}

export default function HoldCountDisplay({
   counts,
   className = "",
   variant = "chips",
   hideZero = true,
   size = "sm",
}: HoldCountDisplayProps) {

   const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
   const textSize = size === "sm" ? "text-xs" : "text-sm";

   return (
      <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
         {holdIcons.map((Icon, i) => {
            const val = counts[i] ?? 0;
            if (hideZero && val === 0) return null; // 0값 노이즈 컷

            // 칩 vs 인라인 스타일
            const Wrapper = ({ children }: { children: React.ReactNode }) =>
               variant === "chips" ? (
                  <span className={`inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 ${textSize}`}>
                     {children}
                  </span>
               ) : (
                  <span className={`inline-flex items-center gap-1.5 ${textSize}`}>
                     {children}
                  </span>
               );

            return (
               <li key={i} className="flex">
                  <Wrapper>
                     <Icon className={`${iconSize}`} aria-hidden />
                     <span className={val === 0 ? "text-muted-foreground" : "font-medium"} aria-label={`레벨 ${i + 1} 개수`}>
                        {val}
                     </span>
                  </Wrapper>
               </li>
            );
         })}
      </ul>
   );
}