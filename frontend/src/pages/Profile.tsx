import React, { useState } from "react";
import { Grid3x3, Bookmark, UserCheck, Settings, Award } from "lucide-react";
import { useMyProfile } from "@/hooks/ProfileHook";
import { PostDetailModal } from "@/modals/PostDetailModal";
import api from "@/lib/axios";
import { Link } from "react-router-dom";

interface Tab {
    id: "posts" | "saved" | "tagged";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const Profile: React.FC<{ userId: string }> = ({ userId }) => {
    const [activeTab, setActiveTab] = useState<Tab["id"]>("posts");
    const { profile, loading, error } = useMyProfile();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    const tabs: Tab[] = [
        { id: "posts", label: "Posts", icon: Grid3x3 },
        { id: "saved", label: "Saved", icon: Bookmark },
        { id: "tagged", label: "Tagged", icon: UserCheck },
    ];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!profile) return null;

    const getCurrentPosts = () => {
        switch (activeTab) {
            case "saved":
                // 아직 API 없음 → 빈 배열 반환
                return profile.savedPosts?.length ? profile.savedPosts : [];
            case "tagged":
                return profile.taggedPosts?.length ? profile.taggedPosts : [];
            default:
                return profile.posts?.length ? profile.posts : [];
        }
    };

    const handleClickPost = async (postId: number) => {
        try {
            const res = await api.get(`/api/posts/${postId}`);
            setSelectedPost(res.data); // ✅ 상세 데이터 세팅
            setIsModalOpen(true);
        } catch (err) {
            console.error("게시물 상세 조회 실패:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                        {/* Profile Image */}
                        <div className="flex justify-center md:justify-start">
                            <div className="relative">
                                <img
                                    src={profile.profileImage}
                                    alt={profile.username}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            {/* Username + Grade + Actions */}
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {profile.userId}
                                    </h1>
                                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                                        <Award className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <Link
                                        to="/profile/settingPage"
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-xl transition-colors inline-block text-center"
                                    >
                                        프로필 편집
                                    </Link>
                                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <Settings className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start gap-8 mb-6">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-900">
                                        {profile.stats.posts}
                                    </div>
                                    <div className="text-sm text-gray-500">게시물</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-900">
                                        {profile.stats.followers}
                                    </div>
                                    <div className="text-sm text-gray-500">팔로워</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-gray-900">
                                        {profile.stats.following}
                                    </div>
                                    <div className="text-sm text-gray-500">팔로우</div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                                {profile.bio}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors relative ${
                                        activeTab === tab.id
                                            ? "text-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {getCurrentPosts().length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getCurrentPosts().map((post: any) => (
                                <div
                                    key={post.id}
                                    className="aspect-square bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                                    onClick={() => handleClickPost(post.id)}
                                >
                                    <img
                                        src={post.thumbnailUrl}
                                        alt={`Post ${post.id}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {activeTab === "posts" && (
                                    <Grid3x3 className="w-8 h-8 text-gray-400" />
                                )}
                                {activeTab === "saved" && (
                                    <Bookmark className="w-8 h-8 text-gray-400" />
                                )}
                                {activeTab === "tagged" && (
                                    <UserCheck className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                게시물이 없습니다.
                            </h3>
                        </div>
                    )}
                </div>
            </div>
            <PostDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                post={selectedPost}
            />
        </div>
    );
};
