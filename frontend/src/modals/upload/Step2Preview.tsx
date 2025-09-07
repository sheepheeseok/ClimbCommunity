import {
    ImageIcon,
    LocationIcon,
} from "@/components/icons/UploadIcons";

type Props = {
    modal: any;
};

export default function Step2Preview({ modal }: Props) {
    const { selectedFiles, formData, setFormData, filePreviews, selectedThumbnail } = modal;

    const difficultyColors = [
        { name: "빨강", color: "bg-red-500", key: "redCount" },
        { name: "보라", color: "bg-purple-500", key: "purpleCount" },
        { name: "갈색", color: "bg-yellow-600", key: "brownCount" },
        { name: "검정", color: "bg-gray-800", key: "blackCount" },
        { name: "하양", color: "bg-gray-200 border border-gray-300", key: "whiteCount" },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="animate-slideIn">
            <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
                {/* Left: Preview */}
                <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">미리보기</h4>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden h-full max-h-96 flex items-center justify-center">
                        {filePreviews.length > 0 ? (
                            selectedFiles[selectedThumbnail]?.type.startsWith("image/") ? (
                                <img
                                    src={filePreviews[selectedThumbnail]}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={filePreviews[selectedThumbnail]}
                                    className="w-full h-full object-cover"
                                    muted
                                    controls
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 flex flex-col space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">장소</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <LocationIcon />
                            </div>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="클라이밍장 이름을 입력하세요"
                                className="w-full pl-10 pr-4 py-3 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">게시물 내용</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="오늘의 클라이밍 경험을 공유해보세요."
                            className="w-full px-4 py-3 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Climb Counts */}
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-2 lg:mb-3">
                            완등 개수 입력
                        </label>
                        <div className="flex flex-wrap gap-2 lg:gap-4">
                            {difficultyColors.map((difficulty) => (
                                <div key={difficulty.key} className="flex items-center space-x-1 lg:space-x-2">
                                    <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${difficulty.color} flex items-center justify-center shadow-sm`}>
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="number"
                                        name={difficulty.key}
                                        value={formData[difficulty.key]}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-12 lg:w-16 px-1 text-black lg:px-2 py-1 border border-gray-200 rounded-md lg:rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 text-center text-xs lg:text-sm transition-all duration-200"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
