import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

/* ---------------------------------------------------------
 * Gym Passes — 이용권 목록 + 아이템 컴포넌트(재사용 가능)
 * - PassList: 리스트/더보기/선택 핸들러
 * - PassCard: 개별 카드(뱃지/설명/가격/선택 버튼)
 * --------------------------------------------------------- */

export type Pass = {
  id: string;
  badge?: string; // 예: 일일권, 주말 회원권
  badgeColor?: "blue" | "green" | "purple" | "gray"; // 뱃지 색상
  title: string; // 한 줄 설명
  price: number; // 숫자만(원)
  priceNote?: string; // 월, 회차 등 안내 텍스트가 필요하면 사용
  disabled?: boolean;
};

export type PassListProps = {
  items: Pass[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  initialVisible?: number; // 처음에 보이는 개수(기본 3)
  className?: string;
};

export function PassList({ items, onSelect, selectedId, initialVisible = 3, className = "" }: PassListProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, initialVisible);
  const hiddenCount = Math.max(0, items.length - visible.length);

  const handleSelect = (id: string) => onSelect?.(id);

  return (
    <section className={className} aria-label="이용권 목록">
      <div className="grid gap-4 md:gap-5">
        {visible.map((p) => (
          <PassCard
            key={p.id}
            pass={p}
            selected={selectedId === p.id}
            onSelect={() => handleSelect(p.id)}
          />
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-primary hover:underline"
            onClick={() => setExpanded(true)}
            aria-label={`${hiddenCount}개의 옵션 전체보기`}
          >
            <span>＋ {hiddenCount}개의 옵션 전체보기</span>
          </button>
        </div>
      )}
    </section>
  );
}

export function PassCard({ pass, onSelect, selected = false }: { pass: Pass; onSelect?: () => void; selected?: boolean }) {
  const { badge, badgeColor = "blue", title, price, priceNote, disabled } = pass;

  const badgeCls = useMemo(() => badgeColorToCls(badgeColor), [badgeColor]);

  return (
    <article
      className={`rounded-2xl border bg-background p-5 md:p-6 flex items-start justify-between gap-4 ${
        selected ? "ring-2 ring-primary border-transparent" : "border-border"
      } ${disabled ? "opacity-60" : ""}`}
      aria-disabled={disabled}
    >
      <div className="min-w-0 flex-1">
        {badge && (
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeCls}`}>{badge}</span>
        )}
        <p className="mt-3 text-sm md:text-base leading-6 text-foreground">{title}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="text-2xl md:text-3xl tracking-tight">{formatKRW(price)}</strong>
          {priceNote && <span className="text-sm text-muted-foreground">{priceNote}</span>}
        </div>
      </div>

      <div className="shrink-0 self-center">
        <Button size="lg" className="rounded-full px-6" disabled={disabled} onClick={onSelect}>
          {selected ? "선택됨" : "선택"}
        </Button>
      </div>
    </article>
  );
}

/* -------------------- utils -------------------- */
function formatKRW(n: number) {
  // 예: 30000 -> 30,000원 (원화 기호 생략하고 '원'만 표기 스타일)
  return new Intl.NumberFormat("ko-KR").format(n) + "원";
}

function badgeColorToCls(c: NonNullable<Pass["badgeColor"]>) {
  switch (c) {
    case "green":
      return "bg-green-100 text-green-700";
    case "purple":
      return "bg-purple-100 text-purple-700";
    case "gray":
      return "bg-muted text-muted-foreground";
    case "blue":
    default:
      return "bg-indigo-100 text-indigo-700";
  }
}