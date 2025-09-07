import { useState, FormEvent, ChangeEvent } from "react";
import api from "@/lib/axios";

interface FindUserIdRequest {
    email?: string;
    tel?: string;
}

interface FindUserIdResponse {
    userId: string;
}

interface FindPasswordRequest {
    userId: string;
    email: string;
}

interface FindPasswordResponse {
    message: string; // 비밀번호 재설정 링크 전송 성공 여부 등
}

export function FindAccountHook() {
    const [activeTab, setActiveTab] = useState<"id" | "password">("password");
    const [findMethod, setFindMethod] = useState<"email" | "phone">("email");
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        userId: "",
        userEmail: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [result, setResult] = useState<string>("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/[^0-9]/g, "");
            if (numericValue.length <= 11) {
                setFormData((prev) => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateIdForm = () => {
        const newErrors: Record<string, string> = {};

        if (findMethod === "email") {
            if (!formData.email.trim()) {
                newErrors.email = "이메일을 입력해주세요.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "올바른 이메일 형식을 입력해주세요.";
            }
        } else {
            if (!formData.phone.trim()) {
                newErrors.phone = "전화번호를 입력해주세요.";
            } else if (formData.phone.length < 10) {
                newErrors.phone = "올바른 전화번호를 입력해주세요.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.userId.trim()) {
            newErrors.userId = "아이디를 입력해주세요.";
        }

        if (!formData.userEmail.trim()) {
            newErrors.userEmail = "등록된 이메일을 입력해주세요.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
            newErrors.userEmail = "올바른 이메일 형식을 입력해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setResult("");

        try {
            if (activeTab === "id") {
                if (!validateIdForm()) return;

                const payload: FindUserIdRequest =
                    findMethod === "email"
                        ? { email: formData.email }
                        : { tel: formData.phone };

                const res = await api.post<FindUserIdResponse>(
                    "/api/auth/findUserId",
                    payload
                    , { withCredentials: false }
                );

                setResult(`가입된 아이디: ${res.data.userId}`);
            } else {
                if (!validatePasswordForm()) return;

                const payload: FindPasswordRequest = {
                    userId: formData.userId,
                    email: formData.userEmail,
                };

                const res = await api.post<FindPasswordResponse>(
                    "/api/auth/findPassword",
                    payload
                    , { withCredentials: false }
                );

                setResult(res.data.message || "비밀번호 재설정 링크를 전송했습니다.");
            }
        } catch (err: any) {
            console.error("❌ 계정 찾기 에러:", err);
            setResult("요청 처리 중 오류가 발생했습니다.");
        }
    };

    return {
        activeTab,
        setActiveTab,
        findMethod,
        setFindMethod,
        formData,
        setFormData,
        errors,
        setErrors,
        result,
        handleInputChange,
        handleSubmit,
    };
}
