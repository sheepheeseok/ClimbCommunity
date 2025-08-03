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
import { Logo } from "@/components/Logo";
import { BellIcon } from "@/components/icons/BellIcon";

import { ChattingActive } from "@/components/icons/ChattingActive";
import HamburgerBtn from "@/pages/home_tap/HamburgerBtn";
import { Button } from "@/components/ui/button"
import { Chatting } from "@/components/icons/Chatting";
import UploadModal from "@/pages/upload_tap/UploadModal";



const PCNavBar = () => {
    const { pathname } = useLocation();

    const navItems = [
        { label: "홈", icon: HomeIcon, activeIcon: HomeIconActive, path: "/" },
        { label: "암장", icon: ClimbIcon, activeIcon: ClimbIconActive, path: "/gyms" },
        { label: "기록", icon: AddPostIcon, activeIcon: AddPostIconActive, },   // 모달만 띄움
        { label: "커뮤니티", icon: CommunityIcon, activeIcon: CommunityIconActive, path: "/community" },
        { label: "마이페이지", icon: AvatarIcon, activeIcon: AvatarIconActive, path: "/mypage" },
        { label: "알림", icon: BellIcon, activeIcon: BellIcon, path: "/alert" },
        { label: "메시지", icon: Chatting, activeIcon: ChattingActive, path: "/chatting" },
    ];

    return (
        <nav className="fixed h-full w-60 top-0 left-0 right-0 bg-white border-t shadow-md flex-col align-middle px-4 py-10 md:flex">
            <Logo className="w-36 h-10 bg-red-500 mb-10 flex justify-center align-middle mx-4"></Logo>

            {/* 네비게이션 버튼 그룹 */}
            <div className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const IconComponent = isActive ? item.activeIcon : item.icon;

                    const button = (
                        <Button
                            key={item.label}
                            variant="ghost"
                            asChild
                            className="h-auto py-2 px-3 flex justify-start items-center gap-3 hover:bg-gray-100"
                        >
                            <Link
                                to={item.path ?? "#"}
                                className="flex items-center gap-3"
                            >
                                <IconComponent className="!w-8 !h-8 shrink-0" />
                                <span className={`text-base text-black ${isActive ? "font-bold" : ""}`}>
                                    {item.label}
                                </span>
                            </Link>
                        </Button>
                    );

                    // "기록" 버튼은 모달로 교체
                    if (item.label === "기록") {
                        return <UploadModal key={item.label} trigger={button} />;
                    }

                    return button;
                })}
            </div>

            <HamburgerBtn />
        </nav>
    );
}

export default PCNavBar;