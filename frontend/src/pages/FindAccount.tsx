import { Link } from "react-router-dom";
import Logo from "@/components/icons/dabeyo-logo.svg";
import { FindAccountHook } from "@/hooks/FindAccountHook";

export default function FindAccount() {
    const {
        activeTab,
        setActiveTab,
        findMethod,
        setFindMethod,
        formData,
        errors,
        result,
        handleInputChange,
        handleSubmit,
    } = FindAccountHook();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-xl border border-white/30">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center">
                        <img src={Logo} alt="DabEyo 로고" className="h-16 w-auto mx-auto" />
                    </Link>
                    <p className="text-gray-600 text-sm">
                        DabEyo 계정 정보를 찾아드립니다
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex mb-8 bg-white/30 backdrop-blur-sm rounded-xl p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("id")}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                            activeTab === "id"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white/60 text-gray-600 hover:bg-white/80"
                        }`}
                    >
                        아이디 찾기
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("password")}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                            activeTab === "password"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white/60 text-gray-600 hover:bg-white/80"
                        }`}
                    >
                        비밀번호 찾기
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === "id" ? (
                        <>
                            {/* 선택 라디오 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    찾기 방법을 선택하세요
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="findMethod"
                                            value="email"
                                            checked={findMethod === "email"}
                                            onChange={(e) =>
                                                setFindMethod(e.target.value as "email" | "phone")
                                            }
                                            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="ml-3 text-sm text-black">이메일로 찾기</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="findMethod"
                                            value="phone"
                                            checked={findMethod === "phone"}
                                            onChange={(e) =>
                                                setFindMethod(e.target.value as "email" | "phone")
                                            }
                                            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="ml-3 text-sm text-black">전화번호로 찾기</span>
                                    </label>
                                </div>
                            </div>

                            {/* Input */}
                            {findMethod === "email" ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        등록된 이메일
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="이메일을 입력하세요"
                                        className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        등록된 전화번호
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="전화번호를 입력하세요"
                                        className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-200"
                            >
                                아이디 찾기
                            </button>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    아이디
                                </label>
                                <input
                                    type="text"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    placeholder="아이디를 입력하세요"
                                    className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                {errors.userId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    등록된 이메일
                                </label>
                                <input
                                    type="email"
                                    name="userEmail"
                                    value={formData.userEmail}
                                    onChange={handleInputChange}
                                    placeholder="등록된 이메일을 입력하세요"
                                    className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                {errors.userEmail && (
                                    <p className="text-red-500 text-xs mt-1">{errors.userEmail}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-200"
                            >
                                비밀번호 재설정 링크 보내기
                            </button>
                        </>
                    )}
                </form>

                {/* 결과 메시지 */}
                {result && (
                    <div className="mt-6 text-center text-sm font-medium text-green-600">
                        {result}
                    </div>
                )}

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-500">
                          또는
                        </span>
                    </div>
                </div>

                {/* Google 버튼 */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 font-medium text-gray-700 shadow-sm"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        계정을 찾으셨나요?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-indigo-500 hover:underline"
                        >
                            로그인하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
