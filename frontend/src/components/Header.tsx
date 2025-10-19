import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/icons/dabeyo-logo.svg";
import api, { setAccessToken } from "@/lib/axios";
import { useUI } from "@/hooks/UIContext";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // 로그인 상태 확인 + 프로필 이미지 가져오기
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        setIsLoggedIn(!!user);
        setProfileImage(user?.profileImage || null);

        // storage 이벤트로 다른 탭/컴포넌트에서 상태 변화 감지
        function handleStorageChange() {
            const updatedUserJson = localStorage.getItem("user");
            const updatedUser = updatedUserJson ? JSON.parse(updatedUserJson) : null;
            setIsLoggedIn(!!updatedUser);
            setProfileImage(updatedUser?.profileImage || null);
        }
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // 바깥 클릭 시 드롭다운 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                event.target instanceof Node &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            await api.post("api/auth/logout");

            setAccessToken(""); // axios 인터셉터 토큰 제거
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("storage"));

            setOpen(false);
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };
    const { setIsSearchOpen, setIsNotificationOpen } = useUI();
    const handleLogoClick = () => {
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="max-w-[1920px] mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" onClick={handleLogoClick} className="inline-flex items-center">
                        <img src={Logo} alt="DabEyo 로고" className="h-14 w-auto" />
                    </Link>

                    {/* Profile */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center space-x-2 hover:bg-gray-50 rounded-full p-2 transition-colors"
                        >
                            <img
                                src={
                                    profileImage ||
                                    "/default-avatar.png" // ✅ public 폴더에 기본 아바타
                                }
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover border"
                            />
                        </button>

                        {/* Dropdown */}
                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                                <div className="py-2">
                                    {isLoggedIn ? (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                내 프로필
                                            </Link>
                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                로그아웃
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            로그인
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
