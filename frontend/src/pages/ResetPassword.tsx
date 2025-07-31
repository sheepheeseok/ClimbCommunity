import { useState, ChangeEvent, FormEvent } from "react";
import InputField from "@/components/InputField";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
   const [step, setStep] = useState<"checkId" | "checkEmail" | "done">("checkId");
   const [form, setForm] = useState({ userId: "", email: "", code: "", newPassword: "" });
   const [loading, setLoading] = useState(false);
   const [emailSent, setEmailSent] = useState(false); // 이메일 전송 여부
   const [emailVerified, setEmailVerified] = useState(false); // 인증코드 확인 여부
   const navigate = useNavigate();

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
   };

   // 단계별 제출
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         if (step === "checkId") {
            // TODO: 아이디 존재 확인 API
            alert("아이디 확인 완료!");
            setStep("checkEmail");
         } else if (step === "checkEmail") {
            if (!form.code) return alert("인증번호를 입력해주세요.");
            // TODO: 인증번호 확인 + 비밀번호 재설정(서버에서 임시 비밀번호 발급) API
            await new Promise((r) => setTimeout(r, 500));
            setStep("done");
         }
      } finally {
         setLoading(false);
      }
   };

   // 이메일 인증 메일 발송
   const handleEmailSend = async () => {
      if (!form.email) return alert("이메일을 입력하세요.");
      setLoading(true);
      try {
         // TODO: 인증 메일 발송 API
         await new Promise((r) => setTimeout(r, 500));
         setEmailSent(true);
      } finally {
         setLoading(false);
      }
   };

   // 인증 코드 확인
   const handleCodeVerify = async () => {
      if (!form.code) return alert("인증번호를 입력하세요.");
      setLoading(true);
      try {
         // TODO: 인증코드 확인 API
         await new Promise((r) => setTimeout(r, 500));
         setEmailVerified(true);
         alert("이메일 인증이 완료되었습니다.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-4">
         <h1 className="text-xl font-bold mb-4">비밀번호 재설정</h1>

         {step === "checkId" && (
            <>
               <InputField
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  placeholder="아이디(6~20자 사이의 소문자 + 숫자 조합)"
               />
               <button type="submit" className="bg-blue-500 text-white py-2 rounded-md" disabled={loading}>
                  {loading ? "확인 중..." : "다음"}
               </button>
            </>
         )}

         {step === "checkEmail" && (
            <>
               {/* 이메일 입력 + 전송 */}
               <div className="flex gap-2">
                  <InputField
                     name="email"
                     value={form.email}
                     onChange={handleChange}
                     placeholder="가입한 이메일 주소 입력"
                  />
                  <button type="button" onClick={handleEmailSend} className="bg-gray-200 px-3 rounded-md">
                     {loading ? "발송 중..." : "인증 메일 발송"}
                  </button>
               </div>

               {/* 안내 메시지 */}
               {emailSent && (
                  <>
                     <p className="text-green-600 text-sm">
                        인증번호가 입력하신 이메일로 발송되었습니다. 확인 후 입력해주세요.
                     </p>
                     <InputField
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="인증번호 입력"
                     />
                     <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded-md"
                        disabled={loading}
                     >
                        {loading ? "처리 중..." : "비밀번호 재설정"}
                     </button>
                  </>
               )}
            </>
         )}

         {step === "done" && (
            <>
               <p className="text-center text-green-600">
                  임시 비밀번호가 이메일로 발송되었습니다. 로그인 후 비밀번호를 변경해주세요.
               </p>
               <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="bg-blue-500 text-white py-2 rounded-md"
               >
                  로그인하러 가기
               </button>
            </>
         )}
      </form>
   );
}
