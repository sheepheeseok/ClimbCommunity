import {Link, useLocation} from "react-router-dom";
import {HomeIcon} from "@/components/icons/HomeIcon";
import {ClimbIcon} from "@/components/icons/ClimbIcon";
import {AddPostIcon} from "@/components/icons/AddPostIcon";
import {CommunityIcon} from "@/components/icons/CommunityIcon";
import {AngleDownIcon} from "@/components/icons/AngleDownIcon";

const MobileNavbar = () => {
    const { pathname } = useLocation();

    const navItems = [
        { label: "홈", icon: HomeIcon, path:"/"},
        { label: "암장", icon: ClimbIcon, path: "/gyms" },
        { label: "기록", icon: AddPostIcon, path: "/logs" },
        { label: "커뮤니티", icon: CommunityIcon, path: "/community" },
        { label: "마이", icon: AngleDownIcon, path: "/mypage" },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-between px-2 py-2 md:hidden z-50">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <Link
                        key={item.label}
                        to={item.path}
                        className="flex flex-col items-center text-xs flex-1"
                    >
                        <item.icon
                            className={`w-6 h-6 mb-1 transition-colors ${
                                isActive ? "text-blue-600" : "text-gray-400"
                            }`}
                        />
                        <span className={isActive ? "text-blue-600" : "text-gray-500"}>
              {item.label}
            </span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default MobileNavbar;