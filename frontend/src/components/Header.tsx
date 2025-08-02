import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { VerifyLocationHook } from "../hooks/VerifyLocationHook";

const Header = () => {
    const { getDisplayedDong, locations, handleVerifyLocation } = VerifyLocationHook();

    return (
        <div className="header w-full z-1000 px-4 py-2.5 absolute left-0 top-0 bg-white flex justify-between items-center">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center bg-white gap-2 text-xl font-semibold">
                    {getDisplayedDong()}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {locations.map((loc, idx) => (
                        <DropdownMenuItem key={idx}>
                            {loc.dong} ({new Date(loc.verifiedAt).toLocaleDateString()})
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={handleVerifyLocation} className="text-blue-600">
                        📍 현재 위치 인증하기
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 알림 버튼 */}
            <Button variant="ghost" size="icon" className="bg-white">
                <Bell className="w-6 h-6" />
            </Button>
        </div>
    );
};

export default Header;