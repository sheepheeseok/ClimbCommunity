import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

interface LoginForm {
    userId: string;
    password: string;
}

export function LoginHook() {
    const [form, setForm] = useState<LoginForm>({ userId: "", password: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrorMsg(""); // 입력값 변경 시 에러 초기화
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.userId || !form.password) {
            setErrorMsg("빈칸 없이 입력하세요.");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("http://localhost:8080/api/auth/login", form);
            const { accessToken } = res.data;

            localStorage.setItem("accessToken", accessToken);

            alert("로그인 성공");
            navigate("/");
            console.log("로그인 정보:", res.data);
            setForm({ userId: "", password: "" });
        } catch (err) {
            setErrorMsg("❌ 아이디 또는 비밀번호가 올바르지 않습니다.");
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        errorMsg,
        loading,
        handleChange,
        handleSubmit,
    };
}
