import Navbar from "./Navbar";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Header />
            <main className="pt-16 md:pl-64 pb-16 md:pb-0">{children}</main>
        </div>
    );
}
