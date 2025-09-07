import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";

export default function Home() {
    return (
        <div className="max-w-[1920px] mx-auto px-4 flex justify-center gap-8">
            {/* Feed */}
            <div className="w-full max-w-2xl">
                <Feed />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-80">
                <Sidebar />
            </div>
        </div>
    );
}

