import Rating from "@/components/Rating";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, ChevronRight } from "lucide-react";
import React from "react";
import type { JSX } from "react";

/**
 * 재사용 가능한 암장 상세 상단(Hero + 메타) 컴포넌트
 * - Figma 시안을 기준으로 PC 우선, 모바일 대응
 * - 별점/아이콘텍스트/리뷰링크 등은 별도 컴포넌트로 분리해 재활용 가능
 */

export type GymSummary = {
  name: string;
  address: string;
  rating: number; // 0~5, 소수점 가능
  visitReviewCount: number; // 방문자 리뷰 수
  logReviewCount: number; // 기록 리뷰 수
  openingText?: string; // 예: "금요일 10:00 ~ 23:00"
  phone?: string; // 숫자만/하이픈 포함 모두 허용
  coverUrl: string; // 대표 이미지 URL
};

export type GymDetailHeaderProps = {
  gym: GymSummary;
  onReserve?: () => void; // 예약 CTA 클릭 핸들러 (라우팅/다이얼로그)
  className?: string;
};

export default function GymDetailHeader({ gym, onReserve, className = "" }: GymDetailHeaderProps) {
  const {
    name,
    address,
    rating,
    visitReviewCount,
    logReviewCount,
    openingText,
    phone,
    coverUrl,
  } = gym;

  return (
    <section className={`w-full ${className}`} aria-label="암장 상세 상단">
      {/* Hero 이미지 */}
      <div className="relative w-full">
        <img
          src={coverUrl}
          alt={`${name} 대표 이미지`}
          className="w-full aspect-[16/9] object-cover rounded-xl border border-border"
        />
      </div>

      {/* 제목/메타/CTA */}
      <div className="mt-6 flex flex-col gap-4 md:gap-6 text-left">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight">{name}</h1>
          <IconText icon={MapPin} text={address} className="text-muted-foreground" />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* 왼쪽: 평점/리뷰/영업/전화 */}
          <div className="flex flex-col gap-3 md:gap-4">
            {/* 평점 + 리뷰 링크 */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
              <Rating value={rating} size={18} readOnly showValue />

              <ReviewLinks
                visitCount={visitReviewCount}
                logCount={logReviewCount}
                onClickVisit={() => { }}
                onClickLog={() => { }}
              />
            </div>

            {/* 영업/전화 */}
            <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm md:text-base">
              {openingText && (
                <IconText icon={Clock} text={openingText} />
              )}
              {phone && (
                <IconText
                  icon={Phone}
                  text={phone}
                  as="a"
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* -------------------- 재사용 컴포넌트 -------------------- */

type IconTextProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  href?: string;
};

export function IconText({ icon: Icon, text, className = "", as: As = "div", href }: IconTextProps) {
  const shared = (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Icon className="size-4 md:size-[18px]" aria-hidden />
      <span className="leading-none">{text}</span>
    </div>
  );

  if (As === "a") {
    return (
      <a href={href} className={`text-foreground hover:underline ${className}`}
        onClick={(e) => { if (!href) e.preventDefault(); }}>
        {shared}
      </a>
    );
  }
  const Comp: any = As;
  return <Comp className={className}>{shared}</Comp>;
}

export function ReviewLinks({
  visitCount,
  logCount,
  onClickVisit,
  onClickLog,
}: {
  visitCount: number;
  logCount: number;
  onClickVisit?: () => void;
  onClickLog?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-primary">
      <button
        className="inline-flex items-center gap-1 hover:underline bg-transparent p-0"
        onClick={onClickVisit}
        aria-label={`방문자 리뷰 ${visitCount}개 보기`}
      >
        <span className="text-sm md:text-base font-bold text-blue-700">방문자 리뷰 {visitCount}</span>
      </button>
      <span className="text-muted-foreground">·</span>
      <button
        className="inline-flex items-center gap-1 hover:underline bg-transparent p-0"
        onClick={onClickLog}
        aria-label={`기록 리뷰 ${logCount}개 보기`}
      >
        <span className="text-sm md:text-base font-bold text-blue-700">기록 리뷰 {logCount}</span>
      </button>
    </div>
  );
}

/**
 * 별점 컴포넌트
 * - 아이콘 5개를 두 겹으로 렌더링(회색 바탕 + 노란색 채움)하고, 퍼센트만큼 클리핑
 * - 시멘틱 레이블 제공
 */
export function StarRating({ value, max = 5, size = 16 }: { value: number; max?: number; size?: number }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="relative inline-flex" aria-label={`별점 ${value.toFixed(1)} / ${max}`}>
      {/* 바탕(회색) */}
      <div className="flex gap-1 text-muted-foreground/40">
        {Array.from({ length: max }).map((_, i) => (
          <StarFilled key={`bg-${i}`} size={size} />
        ))}
      </div>
      {/* 채움(노랑) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
        <div className="flex gap-1 text-yellow-400">
          {Array.from({ length: max }).map((_, i) => (
            <StarFilled key={`fg-${i}`} size={size} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StarFilled({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.59 1.11 6.47L12 17.77l-5.8 3.05 1.11-6.47-4.7-4.59 6.49-.94L12 2.5z" />
    </svg>
  );
}