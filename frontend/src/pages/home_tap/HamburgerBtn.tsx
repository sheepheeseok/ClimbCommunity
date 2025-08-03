import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HamburgerIcon } from "@/components/icons/HamburgerIcon";
import { ActivityMngIcon } from "@/components/icons/ActivityMngIcon";
import { CrewMngIcon } from "@/components/icons/CrewMngIcon";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { SettingIcon } from "@/components/icons/SettingIcon";
import { Link } from "react-router-dom";

export default function HamburgerBtn() {

   const sideMenuItems = [
      { label: "북마크", icon: BookmarkIcon, path: "/bookmark" },
      { label: "활동 관리", icon: ActivityMngIcon, path: "/activity_mng" },
      { label: "크루 관리", icon: CrewMngIcon, path: "/crew_mng" },
      { label: "설정", icon: SettingIcon, path: "/settings" },
   ];

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="bg-transparent flex flex-row items-center gap-3 hover:bg-gray-100 border-none transition-colors">
            <HamburgerIcon /> <span>더보기</span>
         </DropdownMenuTrigger>

         <DropdownMenuContent className="w-60 h-auto mx-4 p-2 gap-3">
            {sideMenuItems.map((item, idx) => (
               <DropdownMenuItem
                  asChild
                  key={idx}
                  className="py-3 px-4 flex items-center gap-3"
               >
                  <Link to={item.path} className="flex items-center gap-3 w-full text-black">
                     <item.icon className="!w-7 !h-7 shrink-0" />
                     <span>{item.label}</span>
                  </Link>
               </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="h-1 bg-gray-100" />

            <DropdownMenuItem asChild className="py-3 px-4 text-black">
               <Link to="/account">계정정보수정</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-3 px-4 text-black">
               <Link to="/logout">로그아웃</Link>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
