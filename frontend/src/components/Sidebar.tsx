import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { followService } from "@/services/followService";
import { useNavigate } from "react-router-dom";

interface SuggestedUser {
    userId: string;
    username: string;
    profileImage?: string;
    isFollowing: boolean;
}

export default function Sidebar() {
    const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await api.get<Omit<SuggestedUser, "isFollowing">[]>("/api/users/me/suggestions");
                const usersWithFlag = res.data.map((u) => ({ ...u, isFollowing: false }));
                setSuggested(usersWithFlag);
            } catch (err) {
                console.error("❌ 추천 친구 불러오기 실패:", err);
            }
        };
        fetchSuggestions();
    }, []);

    // ✅ 팔로우 / 언팔로우 토글 함수
    const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
        try {
            if (isCurrentlyFollowing) {
                // 언팔로우 로직
                await followService.unfollow(targetUserId);
                setSuggested((prev) =>
                    prev.map((user) =>
                        user.userId === targetUserId ? { ...user, isFollowing: false } : user
                    )
                );
            } else {
                // 팔로우 로직
                const status = await followService.follow(targetUserId);
                if (status === "ACCEPTED") {
                    alert("팔로우 완료 ✅");
                } else if (status === "PENDING") {
                    alert("팔로우 요청 전송됨 (상대가 비공개 계정)");
                }
                setSuggested((prev) =>
                    prev.map((user) =>
                        user.userId === targetUserId ? { ...user, isFollowing: true } : user
                    )
                );
            }
        } catch (err: any) {
            console.error("❌ 팔로우/언팔로우 실패:", err);
            alert("요청 처리 중 오류가 발생했습니다.");
        }
    };

    const handleUserClick = (userId: string) => {
        navigate(`/${userId}/profile`);
    };


    return (
        <aside className="w-80 py-8">
            {/* Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">다가오는 이벤트</h2>
                <div className="space-y-4">
                    <a
                        href="https://www.jocamp24.com/"
                        target="_blank"          // 새 탭에서 열기
                        rel="noopener noreferrer" // 보안상 권장
                        className="flex items-start space-x-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                        <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                            <img
                                src="/Camp.png"
                                alt="캠프"
                                className="w-6 h-6 object-contain"
                            />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">조캠프 제휴 이벤트</h3>
                            <p className="text-sm text-gray-500">기간 한정, ~12월 24일</p>
                        </div>
                    </a>
                    <a
                        href="https://www.instagram.com/p/DP9KR5xEVXT/?utm_source=ig_web_copy_link"
                        target="_blank"          // 새 탭에서 열기
                        rel="noopener noreferrer" // 보안상 권장
                        className="flex items-start space-x-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                        <div className="bg-gray-100 rounded-lg p-2 flex-shrink-0">
                            <img
                                src="/event.PNG"
                                alt="이벤트"
                                className="w-6 h-8 object-fill"
                            />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">SHOOK 2025 RE:PLAY</h3>
                            <p className="text-sm text-gray-500">10월 19일(일) ~ 27일(월)</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Suggested Friends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">친구 추천</h2>
                <div className="space-y-4">
                    {suggested.length > 0 ? (
                        suggested.map((user) => (
                            <div key={user.userId} onClick={() => handleUserClick(user.userId)} className="flex items-center justify-between cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={user.profileImage || "/default-avatar.png"}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover border"
                                    />
                                    <div>
                                        <h3
                                            className="font-medium text-gray-900 truncate max-w-[120px]"
                                            title={user.username}
                                        >
                                            {user.username}
                                        </h3>
                                    </div>
                                </div>

                                {/* ✅ Follow ↔ Following 토글 */}
                                <button
                                    onClick={() => handleFollowToggle(user.userId, user.isFollowing)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        user.isFollowing
                                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {user.isFollowing ? "Following" : "Follow"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">추천할 친구가 없습니다.</p>
                    )}
                </div>
            </div>
        </aside>
    );
}
