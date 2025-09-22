export function useAuth() {
    const userJson = localStorage.getItem("user"); // 로그인 시 저장해둔 사용자 정보
    const user = userJson ? JSON.parse(userJson) : null;
    return {
        user,
        isLoggedIn: !!user,
        userId: user?.userId,  // String userId
        id: user?.id,          // Long id (DB PK)
    };
}