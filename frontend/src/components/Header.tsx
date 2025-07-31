import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react"; // shadcn 아이콘

const Header = () => {
   return (
      <div className="header w-full z-1000 px-4 py-2.5 absolute left-0 top-0 bg-white flex justify-between items-center">
         {/* 동네 선택 드롭다운 */}
         <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-xl font-semibold bg-white">
               석촌동
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem>석촌동</DropdownMenuItem>
               <DropdownMenuItem>잠실동</DropdownMenuItem>
               <DropdownMenuItem>가락동</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         {/* 알림 버튼 */}
         <Button variant="ghost" size="icon" className="bg-white">
            <Bell className="w-6 h-6" />
         </Button>
      </div>
   )
}

export default Header;