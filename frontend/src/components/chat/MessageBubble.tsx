import { motion } from "framer-motion";
import { ChatMessage } from "@/hooks/useChat";

interface Props {
    message: ChatMessage;
    myUserId: number;
}

export function MessageBubble({ message, myUserId }: Props) {
    const isMe = message.senderId === myUserId;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
        >
            <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    isMe
                        ? "bg-gradient-to-r from-indigo-400 to-purple-500 text-white"
                        : "bg-gray-100 text-gray-900"
                }`}
            >
                {/* 콘텐츠 출력 */}
                {message.type === "IMAGE" ? (
                    <img
                        src={message.content}
                        alt="이미지"
                        className="rounded-lg max-h-48 object-cover"
                    />
                ) : message.type === "VIDEO" ? (
                    <video
                        controls
                        className="rounded-lg max-h-48"
                        src={message.content}
                    />
                ) : (
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                )}

                {/* timestamp가 서버에서 안 오면 Date.now()로 대체 가능 */}
                <p
                    className={`text-xs mt-1 ${
                        isMe ? "text-blue-100" : "text-gray-500"
                    }`}
                >
                    {new Date().toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </motion.div>
    );
}
