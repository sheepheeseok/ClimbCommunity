
export default function Upload() {
  return (
    <div className="home-tap w-full max-w-md relative min-h-screen overflow-x-hidden">
      <div className="feed w-full left-0 top-[227px] absolute bg-white inline-flex flex-col justify-start items-start gap-8">


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




      
    </div>
  )
}