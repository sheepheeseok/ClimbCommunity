import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

export interface SignUpForm {
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

export function SignupHook() {
    const navigate = useNavigate();

    const [form, setForm] = useState<SignUpForm>({
        userId: "",
        username: "",
        password: "",
        emailLocal: "",
        emailDomain: "",
        phone: "",
        address: "",
        addressDetail: "",
        birthdate: "",
        gender: "",
    });

    const [isCustomEmail, setIsCustomEmail] = useState(false);

    const [errors, setErrors] = useState({
        userId: "",
        password: "",
        phone: "",
        email: "",
        username: "",
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userIdRegex = /^[a-z][a-z0-9]{5,19}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

    const validateEmail = (email: string) => emailRegex.test(email);
    const validateUserId = (id: string) => userIdRegex.test(id);
    const validatePassword = (pw: string) => passwordRegex.test(pw);

    const checkDuplicate = async (type: "userId" | "username", value: string) => {
        try {
            const res = await api.get("http://localhost:8080/api/auth/check-duplicate", {
                params: { [type]: value }
            });

            if (res.data[type]) {
                setErrors((prev) => ({
                    ...prev,
                    [type]: `이미 사용 중인 ${type === "userId" ? "아이디" : "닉네임"}입니다.`
                }));
            } else {
                setErrors((prev) => ({ ...prev, [type]: "" }));
            }
        } catch (err) {
            console.error("❌ 중복 확인 에러:", err);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // 유효성 검사
        if (name === "userId") {
            if (validateUserId(value)) {
                checkDuplicate("userId", value);
            }
        }

        if (name === "username") {
            if (value.trim().length >= 2) {
                checkDuplicate("username", value);
            }
        }

        if (name === "password") {
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(value)
                    ? ""
                    : "비밀번호는 8~20자, 영문+숫자+특수문자를 포함해야 합니다.",
            }));
        }

        if (name === "emailLocal" || name === "emailDomain") {
            const fullEmail =
                name === "emailLocal"
                    ? `${value}@${form.emailDomain}`
                    : `${form.emailLocal}@${value}`;
            setErrors((prev) => ({
                ...prev,
                email: validateEmail(fullEmail) ? "" : "올바른 이메일 주소를 입력하세요.",
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 필수 입력값 검증
        const requiredFields = [
            "userId",
            "username",
            "password",
            "emailLocal",
            ...(isCustomEmail ? [] : ["emailDomain"]),
            "phone",
            "address",
            "addressDetail",
            "birthdate",
            "gender",
        ] as const;

        for (const field of requiredFields) {
            const key = field as keyof SignUpForm;
            if (!form[key] || form[key]?.trim?.() === "") {
                alert("모든 항목을 빠짐없이 입력해주세요.");
                return;
            }
        }

        const fullEmail = isCustomEmail
            ? form.emailLocal
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
            gender: form.gender,
        };

        try {
            const res = await api.post("http://localhost:8080/api/users/register", payload);
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
    };
}
