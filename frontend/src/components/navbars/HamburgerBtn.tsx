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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function HamburgerBtn() {

   const navigate = useNavigate();

   const [user, setUser] = useState<any | null>(null);
   const [loading, setLoading] = useState(true);

   const fetchMyInfo = async () => {
      try {
         const res = await api.get("/api/users/myinfo");
         setUser(res.data);
         localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
         setUser(null);
         localStorage.removeItem("user");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchMyInfo();

      const syncUser = () => {
         const userJson = localStorage.getItem("user");
         setUser(userJson ? JSON.parse(userJson) : null);
      };
      window.addEventListener("storage", syncUser);
      return () => window.removeEventListener("storage", syncUser);
   }, []);

   const isLoggedIn = !!user;

   const sideMenuItems = [
      { label: "북마크", icon: BookmarkIcon, path: "/bookmark" },
      { label: "활동 관리", icon: ActivityMngIcon, path: "/activity_mng" },
      { label: "크루 관리", icon: CrewMngIcon, path: "/crew_mng" },
      { label: "설정", icon: SettingIcon, path: "/settings" },
   ];

   // 로그아웃 처리
   const handleLogout = async () => {
      try {
         await api.post("/api/auth/logout");
      } catch (e) {
         console.error("로그아웃 실패", e);
      } finally {
         localStorage.removeItem("user");
         window.dispatchEvent(new Event("storage")); // UI 갱신
         setUser(null);
      }
   };

   // 로그인 페이지 이동
   const handleLogin = () => {
      navigate("/login");
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="bg-transparent flex flex-row items-center gap-3 hover:bg-gray-100 border-none transition-colors cursor-pointer">
            <HamburgerIcon /> <span>더 보기</span>
         </DropdownMenuTrigger>

         <DropdownMenuContent className="w-60 h-auto mx-4 p-2 gap-3">
            {sideMenuItems.map((item, idx) => (
               <DropdownMenuItem
                  asChild
                  key={idx}
                  className="py-3 px-4 flex items-center gap-3 cursor-pointer"
               >
                  <Link to={item.path} className="flex items-center gap-3 w-full text-black">
                     <item.icon className="!w-7 !h-7 shrink-0" />
                     <span>{item.label}</span>
                  </Link>
               </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="h-1 bg-gray-100" />

            <DropdownMenuItem asChild className="py-3 px-4 text-black cursor-pointer">
               <Link to="/account">계정 정보 수정</Link>
            </DropdownMenuItem>
            {!loading && (
                isLoggedIn ? (
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="py-3 px-4 text-black cursor-pointer"
                    >
                       로그아웃
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={handleLogin}
                        className="py-3 px-4 text-black cursor-pointer"
                    >
                       로그인
                    </DropdownMenuItem>
                )
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}