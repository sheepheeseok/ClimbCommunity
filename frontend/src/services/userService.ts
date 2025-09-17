import api from "@/lib/axios";

export const getMyInfo = async () => {
    const res = await api.get("/api/users/myinfo");
    return res.data;
};

export const updateProfile = async (data: {
    username: string;
    bio: string;
    website: string;
    profileImage?: File | null;
}) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("bio", data.bio);
    formData.append("website", data.website);

    if (data.profileImage) {
        formData.append("profileImage", data.profileImage); // ✅ 파일 포함
    }

    const res = await api.patch("/api/users/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
