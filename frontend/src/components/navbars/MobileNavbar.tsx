import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { ClimbIcon } from "@/components/icons/ClimbIcon";
import { AddPostIcon } from "@/components/icons/AddPostIcon";
import { CommunityIcon } from "@/components/icons/CommunityIcon";
import { AvatarIcon } from "@/components/icons/AvatarIcon";
import { HomeIconActive } from "@/components/icons/HomeIconActive";
import { AvatarIconActive } from "@/components/icons/AvatarIconActive";
import { CommunityIconActive } from "@/components/icons/CommunityIconActive";
import { ClimbIconActive } from "@/components/icons/ClimbIconActive";
import { AddPostIconActive } from "@/components/icons/AddPostIconActive";

const MobileNavbar = () => {
    const { pathname } = useLocation();

    const navItems = [
        { label: "홈", icon: HomeIcon, activeIcon: HomeIconActive, path: "/" },
        { label: "암장", icon: ClimbIcon, activeIcon: ClimbIconActive, path: "/gyms" },
        { label: "기록", icon: AddPostIcon, activeIcon: AddPostIconActive, path: "/logs" },
        { label: "커뮤니티", icon: CommunityIcon, activeIcon: CommunityIconActive, path: "/community" },
        { label: "마이", icon: AvatarIcon, activeIcon: AvatarIconActive, path: "/mypage" },
    ];

    return (
        <nav className="fixed z-50 bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-between px-2 py-2 md:hidden">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = isActive ? item.activeIcon : item.icon;

                return (
                    <Link
                        key={item.label}
                        to={item.path}
                        className="flex flex-col items-center text-xs flex-1"
                    >
                        <IconComponent
                            className="w-6 h-6 mb-1"
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