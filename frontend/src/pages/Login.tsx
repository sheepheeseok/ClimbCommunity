import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginHook } from "@/hooks/LoginHook";
import Logo from "@/components/icons/dabeyo-logo.svg";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { form, errorMsg, loading, handleChange, handleSubmit } = LoginHook();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center">
                        <img src={Logo} alt="DabEyo 로고" className="h-16 w-auto" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">지금 함께 시작해요</h1>
                    <p className="text-gray-600 text-sm">
                        계정으로 로그인하고 커뮤니티 활동을 시작하세요
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* User ID */}
                    <div>
                        <label
                            htmlFor="userId"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            아이디
                        </label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요."
                            required
                            className="w-full text-black px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            비밀번호
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요."
                                required
                                className="w-full text-black px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19
                                                c-4.478 0-8.268-2.943-9.543-7
                                                a9.97 9.97 0 011.563-3.029
                                                m5.858.908a3 3 0 114.243 4.243
                                                M9.878 9.878l4.242 4.242
                                                M9.878 9.878L3 3
                                                m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5
                                                12 5c4.478 0 8.268 2.943 9.542 7
                                                -1.274 4.057-5.064 7-9.542 7
                                                -4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {/* Error Message */}
                        {errorMsg && (
                            <p className="text-red-500 text-sm font-medium mt-2">{errorMsg}</p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <a
                            href="/findAccount"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            비밀번호를 잊으셨나요?
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-8">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500 font-medium">or</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
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

                    {/* Sign In */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        계정이 없으신가요?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
