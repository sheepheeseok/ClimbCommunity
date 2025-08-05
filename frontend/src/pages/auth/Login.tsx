import InputField from "@/components/InputField";
import { useState, ChangeEvent, FormEvent } from "react";

interface InputFieldProps {
   name: string;
   value: string;
   placeholder: string;
   type?: string;
   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
   error?: string;
}

export default function Login() {
   const [form, setForm] = useState({ userId: "", password: "" });
   const [errorMsg, setErrorMsg] = useState("");
   const [loading, setLoading] = useState(false);

   // 입력값 변경
   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrorMsg(""); // 입력값 바뀌면 에러 메시지 초기화
   };

   // 로그인 폼 제출
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 빈칸 체크
      if (!form.userId || !form.password) return alert("빈칸 없이 입력하세요.");

      setLoading(true); // 로그인 버튼 로딩 상태 변경

      try {
         // TODO: 실제 로그인 API 연동
         // await axios.post("/api/login", form);
         alert("로그인 성공!");
         setForm({ userId: "", password: "" });
      } catch {
         setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
      } finally {
         setLoading(false);
      }
   };

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

