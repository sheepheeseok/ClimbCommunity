import { SignupHook } from "@/hooks/SignupHook";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { DaumPostcode } from "@/lib/DaumPostcode";

interface SignUpForm {
   userId: string;
   username: string;
   password: string;
   emailLocal: string;
   emailDomain: string;
   phone?: string;
   address?: string;
   addressDetail?: string;
   birthdate?: string;
   gender?: string;
}

export default function SignUp() {
   const {
      form,
      setForm,
      errors,
      isCustomEmail,
      setIsCustomEmail,
      handleChange,
      handleSubmit,
   } = SignupHook();

   return (
       <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto p-4">
           {/* 아이디 */}
           <div className="flex flex-col">
               <input
                   name="userId"
                   placeholder="아이디"
                   value={form.userId}
                   onChange={handleChange}
                   className="border p-2"
               />
               {errors.userId && <p className="text-red-500 text-sm mt-2">{errors.userId}</p>}
           </div>

           {/* 비밀번호 */}
           <div className="flex flex-col">
               <input
                   type="password"
                   name="password"
                   placeholder="비밀번호"
                   value={form.password}
                   onChange={handleChange}
                   className="border p-2"
               />
               {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
           </div>

           {/* 이메일 입력 - 조건부 렌더링 */}
           <div className="flex gap-2 items-center">
               <input
                   name="emailLocal"
                   placeholder={isCustomEmail ? "직접 입력" : "이메일"}
                   value={form.emailLocal}
                   onChange={handleChange}
                   className={`border p-2 transition-all duration-300 ${
                       isCustomEmail ? "w-full" : "flex-1"
                   }`}
               />
               <span className={`${isCustomEmail ? "w-2" : ""}`}>@</span>
               <select
                   name="emailDomain"
                   value={form.emailDomain}
                   onChange={(e) => {
                       handleChange(e); // 이메일 유효성 검사 포함
                       const selected = e.target.value;
                       setIsCustomEmail(selected === "custom");
                   }}
                   className={`border p-2 transition-all duration-300 ${
                       isCustomEmail ? "ml-2 w-30" : "flex-1"
                   }`}
               >
                   <option value="">선택</option>
                   <option value="gmail.com">gmail.com</option>
                   <option value="naver.com">naver.com</option>
                   <option value="hanmail.net">hanmail.net</option>
                   <option value="kakao.com">kakao.com</option>
                   <option value="custom">직접 입력</option>
               </select>
           </div>
           {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

           {/* 닉네임 */}
           <div className="flex flex-col">
               <input
                   name="username"
                   placeholder="닉네임"
                   value={form.username}
                   onChange={handleChange}
                   className="border p-2"
               />
               {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
           </div>

               {/* 전화번호 */}
               <div className="flex gap-2">
                   <input
                       type="tel"
                       value={form.phone}
                       onChange={(e) => {
                           const formatted = formatPhoneNumber(e.target.value);
                           setForm({...form, phone: formatted});
                       }}
                       placeholder="010-1234-5678"
                       maxLength={13}
                       className="border p-2 flex-1"
                   />
               </div>

               {/* 주소 + 주소 찾기 버튼 */}
               <div className="flex gap-2">
                   <input
                       name="address"
                       placeholder="주소"
                       value={form.address}
                       onChange={handleChange}
                       className="border p-2 flex-1"
                       readOnly
                   />
                   <button
                       type="button"
                       className="bg-gray-300 px-3 text-sm"
                       onClick={() => {
                           DaumPostcode((selectedAddress) => {
                               setForm((prev) => ({ ...prev, address: selectedAddress }));
                           });
                       }}
                   >
                       주소 찾기
                   </button>
               </div>

               {/* 상세 주소 입력 */}
               <input
                   name="addressDetail"
                   placeholder="상세 주소"
                   value={form.addressDetail}
                   onChange={handleChange}
                   className="border p-2"
               />

               {/* 생년월일 (캘린더) */}
               <input
                   type="date"
                   name="birthdate"
                   value={form.birthdate}
                   onChange={handleChange}
                   className="border p-2"
               />

               {/* 성별 */}
               <select
                   name="gender"
                   value={form.gender}
                   onChange={handleChange}
                   className="border p-2"
               >
                   <option value="">성별 선택</option>
                   <option value="male">남성</option>
                   <option value="female">여성</option>
               </select>

               <button type="submit" className="bg-blue-500 text-white py-2">
                   회원가입
               </button>
       </form>
);
}
