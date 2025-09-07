import { Link } from "react-router-dom";
import Logo from "@/components/icons/dabeyo-logo.svg";
import { SignupHook } from "@/hooks/SignupHook";
import { DaumPostcode } from "@/lib/DaumPostcode";

export default function SignUp() {
    const {
        form,
        errors,
        isCustomEmail,
        setIsCustomEmail,
        handleChange,
        handleSubmit,
        checkDuplicate,
    } = SignupHook();

    const emailDomains = [
        "gmail.com",
        "naver.com",
        "daum.net",
        "kakao.com",
        "yahoo.com",
        "outlook.com",
    ];

    const handleAddressClick = () => {
        DaumPostcode((address: string) => {
            handleChange({
                target: { name: "address", value: address },
            } as any);
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-xl border border-white/30">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center">
                        <img src={Logo} alt="DabEyo 로고" className="h-16 w-auto" />
                    </Link>
                    <p className="text-gray-600 text-sm">
                        DabEyo 클라이밍 커뮤니티에 함께하세요
                    </p>
                </div>

                {/* Form */}
                {/* Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e); // ✅ SignupHook에서 가져온 handleSubmit 호출
                    }}
                    className="space-y-5"
                >
                {/* 아이디 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            아이디
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="userId"
                                value={form.userId}
                                onChange={handleChange}
                                placeholder="아이디를 입력하세요"
                                className="flex-1 px-4 py-3 border text-black border-gray-200 rounded-xl
                 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => checkDuplicate("userId", form.userId)} // ✅ 버튼 클릭 시만 API 실행
                                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg
                 hover:bg-indigo-700 transition-colors"
                            >
                                중복확인
                            </button>
                        </div>

                        {errors.userId && (
                            <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
                        )}
                    </div>


                    {/* 닉네임 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            닉네임
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="닉네임을 입력하세요"
                            className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={(form as any).passwordConfirm || ""}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력하세요"
                            className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl
               focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        {form.passwordConfirm !== undefined &&
                            form.passwordConfirm !== form.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    비밀번호가 일치하지 않습니다.
                                </p>
                            )}
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            이메일
                        </label>
                        <div className="flex items-center space-x-2">
                            {/* local part */}
                            <input
                                type="text"
                                name="emailLocal"
                                value={form.emailLocal}
                                onChange={handleChange}
                                placeholder="이메일"
                                className={`px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none
                                    ${isCustomEmail ? "flex-1" : "w-1/2"}
                                `}
                            />

                            {/* @는 custom 아닐 때만 */}
                            {!isCustomEmail && <span className="text-gray-500">@</span>}

                            {/* select */}
                            <select
                                name="emailDomain"
                                value={form.emailDomain}
                                onChange={(e) => {
                                    handleChange(e); // 기존 form 업데이트 로직
                                    setIsCustomEmail(e.target.value === "custom"); // custom 선택 여부 반영
                                }}
                                className="w-1/2 px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                                {emailDomains.map((domain) => (
                                    <option key={domain} value={domain}>
                                        {domain}
                                    </option>
                                ))}
                                <option value="custom">직접 입력</option>
                            </select>
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* 전화번호 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            전화번호
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={(e) => {
                                // 숫자만 허용
                                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                                // 11자리까지 제한
                                if (onlyNums.length <= 11) {
                                    handleChange({
                                        target: { name: "phone", value: onlyNums },
                                    } as any);
                                }
                            }}
                            placeholder="전화번호"
                            maxLength={11}
                            className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>


                    {/* 주소 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            주소
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onClick={handleAddressClick} // 🔥 클릭 시 다음 주소 검색 실행
                            readOnly
                            placeholder="주소를 입력하세요"
                            className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
                        />
                    </div>

                    {/* 상세주소 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            상세주소
                        </label>
                        <input
                            type="text"
                            name="addressDetail"
                            value={form.addressDetail}
                            onChange={handleChange}
                            placeholder="상세주소 (선택)"
                            className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            생년월일
                        </label>
                        <input
                            type="date"
                            name="birthdate"
                            value={form.birthdate}
                            onChange={handleChange}
                            max={new Date().toISOString().split("T")[0]} // 오늘 이후 선택 불가
                            className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl
               focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* 회원가입 버튼 */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        회원가입
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-500 font-medium">
                            또는
                        </span>
                    </div>
                </div>

                {/* Google Login */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 font-medium text-gray-700 shadow-sm"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>

                {/* 로그인 링크 */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        이미 계정이 있으신가요?{" "}
                        <a
                            href="/login"
                            className="text-indigo-600 hover:text-indigo-500 hover:underline"
                        >
                            로그인
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
