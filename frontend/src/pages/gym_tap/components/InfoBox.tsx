import React from "react";

export type InfoBoxProps = {
  title?: string;
  description?: React.ReactNode;
  items?: React.ReactNode[]; // 불릿 목록
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
};

/**
 * InfoBox — 설명글(알림/안내) 박스
 * - 제목/설명/불릿 지원
 * - 아이콘 옵션
 * - 어디서든 재사용 가능한 중립(neutral) 스타일
 */
export default function InfoBox({ title, description, items, icon: Icon, className = "" }: InfoBoxProps) {
  return (
    <section
      role="note"
      className={
        `rounded-2xl border border-border bg-muted/20 p-5 md:p-6 text-left ${className}`
      }
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 shrink-0 text-muted-foreground">
            <Icon className="size-5" aria-hidden />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <h2 className="text-base md:text-lg font-medium tracking-tight mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-sm md:text-base leading-6 text-muted-foreground whitespace-pre-line">{description}</p>
          )}

          {items && items.length > 0 && (
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm md:text-base">
              {items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
