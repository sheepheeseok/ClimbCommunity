import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEditPost } from "@/hooks/useEditPost";

const EditPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { postData, setPostData, loading, saving, error, savePost } =
        useEditPost(postId);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                불러오는 중...
            </div>
        );

    if (error || !postData)
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error ?? "게시물을 찾을 수 없습니다."}
            </div>
        );

    const updateGrade = (index: number, count: number) => {
        const newGrades = [...postData.climbingGrades];
        newGrades[index].count = Math.max(0, count);
        setPostData({ ...postData, climbingGrades: newGrades });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50"
            >
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-neutral-800">게시물 수정</h1>
                    <button
                        onClick={savePost}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="pt-20 pb-24 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-8"
                >
                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                            내용
                        </label>
                        <textarea
                            value={postData.content}
                            onChange={(e) =>
                                setPostData({ ...postData, content: e.target.value })
                            }
                            className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-neutral-800"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-3">
                            위치
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                value={postData.location}
                                onChange={(e) =>
                                    setPostData({ ...postData, location: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-800"
                            />
                        </div>
                    </div>

                    {/* Climbing Grades */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-4">
                            완등 문제 수
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {postData.climbingGrades.map((grade, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${grade.color}`} />
                                    <span className="flex-1 text-sm font-medium text-gray-700">
                    {grade.label}
                  </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateGrade(i, grade.count - 1)}
                                            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center text-sm">
                      {grade.count}
                    </span>
                                        <button
                                            onClick={() => updateGrade(i, grade.count + 1)}
                                            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
            >
                <div className="max-w-2xl mx-auto px-4 py-4 flex space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={savePost}
                        disabled={saving}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </motion.footer>
        </div>
    );
};

export default EditPostPage;
