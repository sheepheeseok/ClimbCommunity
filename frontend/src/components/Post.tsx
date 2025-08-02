const Post = () => {
   return (
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
   )
}

export default Post;