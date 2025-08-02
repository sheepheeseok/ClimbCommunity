import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react"; // shadcn 아이콘
import { AngleDownIcon } from "@/components/icons/AngleDownIcon"

export default function Home() {
  return (
    <div className="home-tap w-full max-w-md relative bg-red">
      <div className="feed w-96 left-0 top-[227px] absolute bg-white inline-flex flex-col justify-start items-start gap-8">
        <div className="post flex flex-col justify-start items-center">
          <div className="post-header w-96 h-12 px-4 relative inline-flex justify-start items-center gap-24">
            <div className="meta-data flex justify-center items-center gap-2.5">
              <img className="avatar size-9 rounded-full" src="https://placehold.co/36x36" />
              <div className="name-group w-48 flex justify-start items-start gap-1">
                <div className="username text-black text-base font-semibold leading-normal">Helena</div>
              </div>
            </div>
            <div className="icon-more w-0 h-6 left-[353px] top-[14px] absolute origin-top-left -rotate-90 overflow-hidden" />
          </div>
          <div className="post-content flex flex-col justify-center items-center gap-3">
            <img className="post-image size-96 relative" src="https://placehold.co/393x393" />
            <div className="pagination inline-flex justify-center items-center gap-[5px] overflow-hidden">
              <div className="dot selected size-[5px] bg-black/80 rounded-full" />
              <div className="dot size-[5px] bg-black/20 rounded-full" />
              <div className="dot size-[5px] bg-black/20 rounded-full" />
              <div className="dot size-[5px] bg-black/20 rounded-full" />
              <div className="dot size-[5px] bg-black/20 rounded-full" />
            </div>
            <div className="description-actions w-96 px-4 flex flex-col justify-center items-start gap-3">
              <div className="post-actions self-stretch h-6 inline-flex flex-col justify-start items-start">
                <div className="save inline-flex justify-end items-center gap-2">
                  <div className="icon-bookmark size-6 relative overflow-hidden">
                    <div className="vector w-3.5 h-4 left-[5px] top-[3px] absolute bg-black" />
                  </div>
                </div>
                <div className="actions inline-flex justify-start items-center gap-4">
                  <div className="likes flex justify-start items-center gap-2">
                    <div className="icon-heart size-6 relative overflow-hidden">
                      <div className="vector size-5 left-[1.55px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-black" />
                    </div>
                    <div className="count text-black text-sm font-medium leading-tight">21</div>
                  </div>
                  <div className="comments flex justify-start items-center gap-2">
                    <div className="icon-comments size-6 relative overflow-hidden">
                      <div className="vector size-4 left-[3px] top-[3px] absolute outline outline-2 outline-offset-[-1px] outline-black" />
                    </div>
                    <div className="count text-black text-sm font-medium leading-tight">4</div>
                  </div>
                </div>
              </div>
              <div className="post-description self-stretch h-10 text-black text-sm leading-tight">
                포스트 설명<br />
                포스트 이미지 or 영상은 실제 비율에 맞춰 보여준다.
              </div>
              <div className="post-time w-64 h-4 text-zinc-500 text-xs leading-none">2시간 전</div>
            </div>
          </div>
        </div>
        <div className="recommended px-4 flex flex-col justify-start items-start gap-3">
          <div className="title text-black text-base font-bold leading-snug">회원님을 위한 추천 암장</div>
          <div className="gym-list inline-flex justify-start items-start gap-3">
            {["1", "2", "3"].map((i) => (
              <div key={i} className="gym-item w-28 inline-flex flex-col justify-start items-start gap-2">
                <img className="gym-image size-28 relative rounded-lg" src="https://placehold.co/120x120" />
                <div className="gym-name w-16 text-black text-sm font-bold leading-tight">암장{i}지점명</div>
                <div className="gym-location w-64 text-zinc-500 text-xs leading-none">송파구 석촌동</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar w-96 h-14 left-0 top-[742px] absolute bg-white shadow-[0px_-0.5px_2px_0px_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
        <div className="tabs w-96 h-14 left-0 top-0 absolute overflow-hidden">
          {["홈", "암장", "기록", "커뮤니티", "마이"].map((label, idx) => (
            <div key={idx} className="tab-item w-20 h-14 px-6 py-2 absolute inline-flex flex-col justify-center items-center gap-0.5" style={{ left: `${idx * 79}px` }}>
              <div className="icon size-6 relative overflow-hidden" />
              <div className="label text-black text-xs font-medium leading-none">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="header w-full z-1000 px-4 py-2.5 absolute left-0 top-0 bg-white flex justify-between items-center">
        {/* 동네 선택 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-xl font-semibold">
            석촌동
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>석촌동</DropdownMenuItem>
            <DropdownMenuItem>잠실동</DropdownMenuItem>
            <DropdownMenuItem>가락동</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 알림 버튼 */}
        <Button variant="ghost" size="icon">
          <Bell className="w-6 h-6" />
        </Button>
      </div>

      {/* Crew Section */}
      <div className="crew-section w-96 h-32 left-[16px] top-[92px] absolute">
        <div className="title text-black text-lg font-bold leading-relaxed">우리 동네 크루</div>
        <div className="crew-list flex gap-4 mt-2 overflow-x-scroll">
          {Array(6).fill(0).map((_, idx) => (
            <div key={idx} className="crew-item w-16 h-24 flex flex-col justify-center items-center gap-1">
              <img className="crew-image size-12 rounded-full" src="https://placehold.co/48x48" />
              <div className="crew-name text-black text-sm font-medium leading-tight">크루명</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}