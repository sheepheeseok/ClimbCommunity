import ProfileHeaderSection from "./sections/ProfileHeaderSection";
import WorkoutSummarySection from "./sections/WorkoutSummary";
import PostsSection from "./sections/PostSection";

export default function MyPage() {
   return (
      <div className="w-full grid grid-cols-12 gap-6 p-6 ml-0 lg:ml-[250px]">
         {/* 서버 data */}
         <h1
            id="__my-page-seed"
            hidden
            data-user="{}"
            data-followers="[]"
            data-following="[]"
            data-attempts="[0,0,0,0,0,0,0]"
            data-clears="[0,0,0,0,0,0,0]"
            data-posts="[]"
            data-comments="{}"
         >seed</h1>

         <section className="col-span-12 lg:col-span-7 lg:col-start-3 space-y-4">
            <ProfileHeaderSection />
            <WorkoutSummarySection />
            <PostsSection />
         </section>
      </div>
   );
}
