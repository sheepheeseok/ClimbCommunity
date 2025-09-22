// src/components/chat/ChatWindow.tsx
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageCircle } from "@/components/icons/MessageCircle";
import { Send, Smile, Paperclip } from "@/components/icons/ChatIcons";
import { useChat } from "@/hooks/useChat";

interface Props {
    activeChat: any;
    myUserId: string;
}

export function ChatWindow({ activeChat, myUserId }: Props) {
    const { messages, typingUser, sendMessage, sendTyping, sendFile } = useChat(activeChat.roomId, myUserId);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage, "CHAT");
            setNewMessage("");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            sendFile(e.target.files[0]);
        }
    };

    if (!activeChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">메시지를 선택하세요</h3>
                    <p className="text-gray-500">대화를 시작하려면 왼쪽에서 채팅을 선택하세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                <img
                    src={activeChat.profileImage}
                    alt={activeChat.username}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold text-gray-900">{activeChat.username}</h3>
                    <p className="text-sm text-gray-500">@{activeChat.userId}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} myUserId={myUserId} />
                ))}
                {typingUser && (
                    <div className="text-gray-500 italic text-sm ml-2">상대방이 입력중...</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <div className="flex items-center space-x-3">
                    <button type="button" className="p-2 text-gray-500 hover:bg-gray-700/10 rounded-full">
                        <Smile className="w-5 h-5" />
                    </button>
                    <label className="p-2 text-gray-500 hover:bg-gray-700/10 rounded-full cursor-pointer">
                        <Paperclip className="w-5 h-5" />
                        <input type="file" hidden onChange={handleFileChange} />
                    </label>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            sendTyping();
                        }}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-4 py-3 text-black bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
