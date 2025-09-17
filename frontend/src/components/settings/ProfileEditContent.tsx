import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { getMyInfo } from "@/services/userService";
import api from "@/lib/axios";

interface ProfileData {
    username: string;
    bio: string;
    website: string;
    phone: string;
    email: string;
    profileImage: string;
}

export const ProfileEditContent: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        username: "",
        bio: "",
        website: "",
        phone: "",
        email: "",
        profileImage: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ 사용자 정보 불러오기
    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const data = await getMyInfo();
                setProfileData({
                    username: data.username || "",
                    bio: data.bio || "",
                    website: data.website || "",
                    phone: data.tel || "",
                    email: data.email || "",
                    profileImage: data.profileImage || "",
                });
            } catch (err) {
                console.error("프로필 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyInfo();
    }, []);

    // ✅ 이미지 선택 핸들러
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file)); // 미리보기 이미지
        }
    };

    // ✅ 저장 핸들러
    const handleSave = async () => {
        try {
            const formData = new FormData();

            // dto를 JSON Blob으로 append
            formData.append(
                "dto",
                new Blob(
                    [
                        JSON.stringify({
                            username: profileData.username,
                            bio: profileData.bio,
                            website: profileData.website,
                        }),
                    ],
                    { type: "application/json" }
                )
            );

            // 선택된 이미지 추가
            if (selectedFile) {
                formData.append("profileImage", selectedFile);
            }

            const res = await api.patch("/api/users/updateProfile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // ✅ localStorage의 user 갱신
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                parsedUser.profileImage = res.data.profileImage; // 새 이미지 URL 반영
                localStorage.setItem("user", JSON.stringify(parsedUser));
                window.dispatchEvent(new Event("storage")); // Header 컴포넌트 리렌더 트리거
            }

            alert("프로필이 성공적으로 업데이트되었습니다!");
        } catch (err) {
            console.error("업데이트 실패:", err);
            alert("업데이트 중 오류 발생");
        }
    };

    if (loading) return <p className="text-gray-500">불러오는 중...</p>;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-black"
        >
            <div>
                <h2 className="text-2xl font-bold mb-2">프로필 편집</h2>
                <p className="text-gray-600">프로필 정보를 수정하고 관리하세요.</p>
            </div>

            {/* 프로필 사진 */}
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <img
                        src={
                            previewImage ||
                            profileData.profileImage ||
                            "/default-avatar.png" // ✅ public 폴더에 기본 아바타 넣기
                        }
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                </div>

                <div>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer">
                        사진 변경
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                        JPG, PNG 파일만 업로드 가능합니다.
                    </p>
                </div>
            </div>

            {/* 입력 필드 */}
            <div className="space-y-6">
                {/* 사용자 이름 */}
                <div>
                    <label className="block text-sm font-medium mb-2">사용자 이름</label>
                    <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) =>
                            setProfileData({ ...profileData, username: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                </div>

                {/* 소개 */}
                <div>
                    <label className="block text-sm font-medium mb-2">소개</label>
                    <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                            setProfileData({ ...profileData, bio: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                    />
                    <p className="text-sm text-gray-500 mt-1">150자 이내로 작성해주세요.</p>
                </div>

                {/* 웹사이트 */}
                <div>
                    <label className="block text-sm font-medium mb-2">웹사이트</label>
                    <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) =>
                            setProfileData({ ...profileData, website: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                    변경사항 저장
                </button>
            </div>
        </motion.div>
    );
};
