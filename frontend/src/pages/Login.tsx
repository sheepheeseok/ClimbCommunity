import InputField from "@/components/InputField";
import { LoginHook } from "@/hooks/LoginHook";

export default function Login() {
   const {
      form,
      errorMsg,
      loading,
      handleChange,
      handleSubmit,
   } = LoginHook();

   return (
      <>
         <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">로그인</h1>

            <InputField
               name="userId"
               value={form.userId}
               onChange={handleChange}
               placeholder="아이디(6~20자 사이의 소문자 + 숫자 조합)"
            />
            <InputField
               name="password"
               type="password"
               value={form.password}
               onChange={handleChange}
               placeholder="비밀번호(8~20자 사이의 영문+숫자+특수문자 조합"
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <button
               type="submit"
               className="bg-blue-500 text-white py-2 rounded-md"
               disabled={loading}
            >
               {loading ? "로그인 중..." : "로그인"}
            </button>
         </form>
      </>
   );
}

