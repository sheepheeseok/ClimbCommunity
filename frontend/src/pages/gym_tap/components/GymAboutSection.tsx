import React from "react";
import { Info } from "lucide-react";
import InfoBox from "./InfoBox";

export type GymAboutProps = {
  about?: string;
  highlights?: string[];
  className?: string;
};

/**
 * GymAboutSection — 암장 상세 하단의 안내/설명 박스
 * - 내부적으로 재사용 컴포넌트 InfoBox 사용
 */
export default function GymAboutSection({ about, highlights, className = "" }: GymAboutProps) {
  if (!about && (!highlights || highlights.length === 0)) return null;
  return (
    <div className={className}>
      <InfoBox
        title={undefined}
        description={about}
        items={highlights}
        icon={Info}
      />
    </div>
  );
}
