import Navbar from "./Navbar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isMessagesPage = location.pathname.startsWith("/messagesPage");

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <Header/>
            <main
                className="pt-16 pb-16 md:pb-0 transition-all duration-300"
                style={{paddingLeft: isMessagesPage ? "92px" : "256px"}}
            >
                {children}
            </main>
        </div>
    );
}
