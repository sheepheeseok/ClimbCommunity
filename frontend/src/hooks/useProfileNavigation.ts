import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function useProfileNavigation() {
    const navigate = useNavigate();
    const { userId: myUserId } = useAuth(); // ✅ 현재 로그인한 유저 ID

    const goToProfile = (e: React.MouseEvent, userId?: string) => {
        if (!userId) return;
        e.stopPropagation(); // 부모 클릭 이벤트 막기

        if (userId === myUserId) {
            // ✅ 내 프로필
            navigate("/profile");
        } else {
            // ✅ 다른 사람 프로필
            navigate(`/${userId}/profile`);
        }
    };

    return { goToProfile };
}