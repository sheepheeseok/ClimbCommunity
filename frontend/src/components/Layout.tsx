import Navbar from "./Navbar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    const isMessagesPage = location.pathname.startsWith("/ChatPage");
    const isMessages = location.pathname.startsWith("/messages");
    const isAnySidebarOpen = isMessagesPage || isMessages;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Header />

            <main
                className={`
                    pt-16 
                    transition-all duration-300
                    lg:pb-0
                    pb-16        /* ✅ 모바일에서 하단바 높이 확보 */
                    ${isAnySidebarOpen ? "lg:pl-[92px]" : "lg:pl-[256px]"} 
                    pl-0         /* ✅ 모바일에서는 왼쪽 패딩 제거 */
                `}
            >
                {children}
            </main>
        </div>
    );
}
