import { useState, ChangeEvent, FormEvent } from "react";

interface SignUpForm {
   userId: string;     // 아이디
   username: string;    // 닉네임
   password: string;
   email: string;
   phone?: string;   // 선택 입력
   address?: string;
   age?: number;
   gender?: string;
}

export default function SignUp() {
   const [form, setForm] = useState<SignUpForm>({
      userId: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      address: "",
      age: 0,
      gender: ""
   });

   // 아이디, 비밀번호, 이메일, 전화번호 유효성 검사
   const userIdRegex = /^[a-z][a-z0-9]{5,19}$/; // 첫문자 소문자, 소문자 + 숫자만 6~20자 이내
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ~@~.~
   const phoneRegex = /^010\d{4}\d{4}$/; // 010xxxxxxxx

   // 유효성 검사 함수
   const validateUserId = (id: string) => userIdRegex.test(id);
   const validatePassword = (pw: string) => passwordRegex.test(pw);
   const validateEmail = (email: string) => emailRegex.test(email);
   const validatePhone = (phone: string) => phoneRegex.test(phone);

   // 아이디, 비번 검사 함수
   const [errors, setErrors] = useState({ userId: "", password: "", phone: "", email: "" });

   // 입력값 변경
   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      // 아이디, 비번 실시간 검사
      if (name === "userId") {
         setErrors((prev) => ({
            ...prev,
            userId: validateUserId(value)
               ? ""
               : "아이디는 소문자 시작, 소문자+숫자 조합 6~20자여야 합니다."
         }));
         setUserIdChecked(false); // 아이디 변경 시 중복확인 다시
      }
      if (name === "password") {
         setErrors((prev) => ({
            ...prev,
            password: validatePassword(value)
               ? ""
               : "비밀번호는 8~20자, 영문+숫자+특수문자를 각각 1개 이상 포함해야 합니다."
         }));
      }
      if (name === "username") {
         setUsernameChecked(false); // 닉네임 변경 시 중복확인 다시 필요
      }
      if (name === "email") {
         setErrors((prev) => ({
            ...prev,
            email: validateEmail(value) ? "" : "올바른 이메일 주소를 입력하세요."
         }));
      }
      if (name === "phone") {
         setErrors((prev) => ({
            ...prev,
            phone: validatePhone(value) ? "" : "올바른 전화번호를 입력하세요."
         }));
      }
   };

   // 아이디, 비번, 닉네임, 이메일 빈칸 체크
   const validateRequiredFields = () => {
      if (!form.userId) return "아이디를 입력하세요.";
      if (!form.password) return "비밀번호를 입력하세요.";
      if (!form.username) return "닉네임을 입력하세요.";
      if (!form.email) return "이메일을 입력하세요.";
      return "";
   };

   // 아이디, 닉네임 중복 체크
   const [userIdChecked, setUserIdChecked] = useState(false);
   const [usernameChecked, setUsernameChecked] = useState(false);

   // 로딩중 상태
   const [loadingCheckUserId, setLoadingCheckUserId] = useState(false);
   const [loadingCheckUsername, setLoadingCheckUsername] = useState(false);
   const [loadingSubmit, setLoadingSubmit] = useState(false);

   // 중복확인 버튼 배경색 설정
   const getButtonClass = (checked: boolean, loading: boolean) => {
      if (loading) return "bg-blue-300 text-white px-3"; // 로딩 중
      return checked
         ? "bg-green-500 text-white px-3" // 확인 완료
         : "bg-gray-200 text-black px-3"; // 기본
   };

   // 아이디, 닉네임 중복 확인 공용 함수
   const handleDuplicateCheck = async (type: "userId" | "username") => {
      const value = form[type];
      if (!value) return alert(`${type === "userId" ? "아이디" : "닉네임"}을 입력하세요.`);

      // 로딩 상태 변경
      if (type === "userId") setLoadingCheckUserId(true);
      else setLoadingCheckUsername(true);

      try {
         // TODO: 실제 API로 교체
         // const { data } = await axios.get(`/api/check-${type}?${type}=${value}`);
         await new Promise((r) => setTimeout(r, 500)); // 가짜 딜레이
         const isDuplicate = value === "test"; // 가짜 로직
         if (isDuplicate) {
            if (type === "userId") setUserIdChecked(false);
            else setUsernameChecked(false);
         } else {
            if (type === "userId") setUserIdChecked(true);
            else setUsernameChecked(true);
         }
      } catch (err) {
         alert(`${type === "userId" ? "아이디" : "닉네임"} 확인 중 오류가 발생했습니다.`);
      } finally {
         // 로딩 상태 변경
         if (type === "userId") setLoadingCheckUserId(false);
         else setLoadingCheckUsername(false);
      }
   };

   // 회원가입 제출
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 빈칸 체크
      const errorMsg = validateRequiredFields();
      if (errorMsg) return alert(errorMsg);

      if (!validateUserId(form.userId)) {
         return alert("아이디 조건을 확인하세요.");
      }
      if (!validatePassword(form.password)) {
         return alert("비밀번호 조건을 확인하세요.");
      }
      if (!userIdChecked) return alert("아이디 중복 확인을 해주세요.");
      if (!usernameChecked) return alert("전화번호 중복 확인을 해주세요.");

      // 회원가입버튼 로딩 상태 변경
      setLoadingSubmit(true);
      try {
         // TODO: 실제 API로 교체
         // const { data } = await axios.post("/api/signup", form);
         await new Promise((r) => setTimeout(r, 500));
         alert("회원가입 성공!");
         setForm({ userId: "", username: "", password: "", email: "", phone: "", address: "", age: 0, gender: "" });
         setUserIdChecked(false);
         setUsernameChecked(false);
      } catch (err) {
         alert("회원가입 중 오류가 발생했습니다.");
      } finally {
         // 회원가입버튼 로딩 상태 변경
         setLoadingSubmit(false);
      }
   };

   return (
      <>
         <h1 className="text-xl font-bold my-4">회원가입</h1>
         <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto p-4">
            {/* 아이디 + 중복 확인 */}
            <div className="flex flex-col">
               <div className="flex gap-2">
                  <input name="userId" placeholder="아이디(6~20자 사이의 소문자 + 숫자 조합)" value={form.userId} onChange={handleChange} className="border p-2 flex-1" />
                  <button type="button" onClick={() => handleDuplicateCheck("userId")} className={getButtonClass(userIdChecked, loadingCheckUserId)} disabled={loadingCheckUserId}>
                     {loadingCheckUserId ? "확인중..." : "중복 확인"}
                  </button>
               </div>
               {errors.userId && <p className="text-red-500 text-sm">{errors.userId}</p>}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col">
               <input type="password" name="password" placeholder="비밀번호(8~20자 사이의 영문+숫자+특수문자 조합" value={form.password} onChange={handleChange} className="border p-2" />
               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* 닉네임 + 중복 확인 */}
            <div className="flex gap-2">
               <input name="username" placeholder="닉네임" value={form.username} onChange={handleChange} className="border p-2 flex-1" />
               <button type="button" onClick={() => handleDuplicateCheck("username")} className={getButtonClass(usernameChecked, loadingCheckUsername)} disabled={loadingCheckUsername}>
                  {loadingCheckUsername ? "확인중..." : "중복 확인"}
               </button>
            </div>
            {/* 전화번호 + 중복 확인 */}
            <div className="flex flex-col">
               <div className="flex gap-2">
                  <input name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} className="border p-2 flex-1" />
                  <button type="button" onClick={() => { }} className="bg-gray-200 px-3" >{"본인인증"}
                  </button>
               </div>
               {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            {/* 주소 */}
            <input name="address" placeholder="주소" value={form.address} onChange={handleChange} className="border p-2" />
            {/* 나이 */}
            <input name="age" placeholder="나이" value={form.age} onChange={handleChange} className="border p-2" />
            {/* 성별 */}
            <select name="gender" value={form.gender} onChange={handleChange} className="border p-2">
               <option value="">성별 선택</option>
               <option value="male">남성</option>
               <option value="female">여성</option>
            </select>
            {/* 이메일 */}
            <div className="flex flex-col">
               <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} className="border p-2" />
               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            {/* 제출 버튼 */}
            <button type="submit" className="bg-blue-500 text-white py-2" disabled={loadingSubmit}>
               {loadingSubmit ? "처리중..." : "회원가입"}
            </button>
         </form>
      </>
   );
}
