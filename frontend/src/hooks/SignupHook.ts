import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

export interface SignUpForm {
    userId: string;
    username: string;
    password: string;
    passwordConfirm?: string;
    emailLocal: string;
    emailDomain: string; // 일반 모드에서는 select 값, custom 모드에서는 전체 이메일
    phone?: string;
    address?: string;
    addressDetail?: string;
    birthdate?: string;
}

export function SignupHook() {
    const navigate = useNavigate();

    const [form, setForm] = useState<SignUpForm>({
        userId: "",
        username: "",
        password: "",
        passwordConfirm: "",
        emailLocal: "",
        emailDomain: "gmail.com",
        phone: "",
        address: "",
        addressDetail: "",
        birthdate: "",
    });

    const [isCustomEmail, setIsCustomEmail] = useState(false);

    const [errors, setErrors] = useState({
        userId: "",
        password: "",
        phone: "",
        email: "",
        username: "",
    });

    // 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userIdRegex = /^[a-z][a-z0-9]{5,19}$/;
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    const emailLocalRegex = /^[a-zA-Z0-9._-]+$/;
    const customEmailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateEmail = (email: string) => emailRegex.test(email);
    const validateUserId = (id: string) => userIdRegex.test(id);
    const validatePassword = (pw: string) => passwordRegex.test(pw);

    // 아이디/닉네임 중복체크
    const checkDuplicate = async (type: "userId" | "username", value: string) => {
        try {
            const res = await api.get("/api/auth/check-duplicate", {
                params: { [type]: value },
            });

            if (res.data[type]) {
                setErrors((prev) => ({
                    ...prev,
                    [type]: `이미 사용 중인 ${type === "userId" ? "아이디" : "닉네임"}입니다.`,
                }));
            } else {
                setErrors((prev) => ({ ...prev, [type]: "" }));
            }
        } catch (err) {
            console.error("❌ 중복 확인 에러:", err);
        }
    };

    // 입력값 변경 핸들러
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // 비밀번호 유효성
        if (name === "password") {
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(value)
                    ? ""
                    : "비밀번호는 8~20자, 영문+숫자+특수문자를 포함해야 합니다.",
            }));
        }

        // emailLocal → 일반 모드일 때만 검사
        if (name === "emailLocal" && !isCustomEmail) {
            if (!emailLocalRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: "아이디 부분에는 영문, 숫자, '.', '-', '_'만 사용할 수 있습니다.",
                }));
                return;
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        }

        // emailDomain → custom 모드일 때 전체 이메일 검사
        if (name === "emailDomain" && isCustomEmail) {
            if (!customEmailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: "올바른 전체 이메일 주소를 입력하세요.",
                }));
                return;
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        }

        // 최종 이메일 유효성 검사
        if (name === "emailLocal" || name === "emailDomain") {
            let fullEmail = "";

            if (isCustomEmail) {
                fullEmail = value; // 사용자가 입력한 그대로 (select=custom일 때는 input 박스로 직접 받음)
            } else {
                fullEmail =
                    name === "emailLocal"
                        ? `${value}@${form.emailDomain}`
                        : `${form.emailLocal}@${value}`;
            }

            setErrors((prev) => ({
                ...prev,
                email: validateEmail(fullEmail) ? "" : "올바른 이메일 주소를 입력하세요.",
            }));
        }
    };

    // 제출 핸들러
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fullEmail = isCustomEmail
            ? form.emailDomain
            : `${form.emailLocal}@${form.emailDomain}`;

        if (!validateEmail(fullEmail)) {
            alert("이메일 형식이 올바르지 않습니다.");
            return;
        }

        const payload = {
            userId: form.userId,
            username: form.username,
            password: form.password,
            email: fullEmail,
            tel: form.phone,
            address1: form.address,
            address2: form.addressDetail,
            birthdate: form.birthdate,
        };

        try {
            const res = await api.post("/api/users/register", payload);
            alert("회원가입 완료!");
            navigate("/login");
            console.log("✅ 회원가입 결과:", res.data);
        } catch (err) {
            alert("회원가입 중 오류가 발생했습니다.");
            console.error("❌ 에러:", err);
        }
    };

    return {
        form,
        setForm,
        errors,
        isCustomEmail,
        setIsCustomEmail,
        handleChange,
        handleSubmit,
        checkDuplicate,
    };
}
