import React from "react";
import { useParams } from "react-router-dom";
import GymDetailHeader, { type GymSummary } from "./components/GymDetailHeader";
import GymAboutSection from "./components/GymAboutSection";
import { PassList } from "./components/Passes";

// 최소 버전: 상단 헤더만 렌더링 (탭/본문은 이후 단계에서 추가)

const MOCK_SUMMARY: GymSummary = {
  name: "더클라임 클라이밍 연남점",
  address: "서울특별시 마포구 양화로 186 3층",
  rating: 4.5,
  visitReviewCount: 72,
  logReviewCount: 21,
  openingText: "금요일 10:00 ~ 23:00",
  phone: "0507-1460-0343",
  coverUrl:
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1600&auto=format&fit=crop",
};

export default function GymDetail() {
  // 향후 /gyms/:id 사용을 위한 자리(지금은 MOCK으로 렌더)
  const { id } = useParams();
  void id;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 md:px-24 py-6 pb-16 lg:ml-[250px] flex flex-col gap-8">
      <GymDetailHeader gym={MOCK_SUMMARY} onReserve={() => console.log("예약 클릭")} />

      <GymAboutSection
        about={`위례 광장근 오벨리스크 지하1층에 위치한 실내 클라이밍 짐 그린필입니다.
125평 규모의 넓고 쾌적한 실내 암벽장으로, 남녀노소 누구나 즐길 수 있는 운동시설입니다.`}
        highlights={[
          "친절한 강사들과 함께 클라이밍 도전해 보세요!",
          "할인권, 세척실, 샤워실 구비",
          "낮은 주차시설요금(무료 3시간, 시간당 500원)",
          "네이버 방문/기록 리뷰 작성 이벤트",
          "안전한 실내클라이밍을 마음껏 즐겨보세요.",
        ]}
      />

      <PassList
        items={[
          { id: "d1", badge: "일일권", badgeColor: "purple", title: "일일체험 강습 30분+자유이용 + 암벽화 대여", price: 30000 },
          { id: "w1", badge: "주말 회원권", badgeColor: "green", title: "주말반 [4회 강습, 주 1회] - 강습 당일 자유이용 가능", price: 120000 },
          { id: "b1", badge: "기초 회원권", badgeColor: "blue", title: "기초반 [7회 강습, 주 2회] - 자유이용 가능", price: 200000 },
        ]}
        selectedId={"w1"}
        onSelect={(id) => console.log("선택:", id)}
      />
    </div>
  );
}
