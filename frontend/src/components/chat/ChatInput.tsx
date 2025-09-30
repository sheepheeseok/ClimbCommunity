// src/components/chat/ChatInput.tsx
import { useState, useRef } from "react";
import { Smile, Paperclip, Send } from "@/components/icons/ChatIcons";

interface Props {
    onSend: (message: string) => void;
    onTyping: () => void;
    onFileSend: (file: File) => void;
}

export function ChatInput({ onSend, onTyping, onFileSend }: Props) {
    const [newMessage, setNewMessage] = useState("");
    const typingTimeout = useRef<number | null>(null);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSend(newMessage);
            setNewMessage("");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSend(e.target.files[0]);
        }
    };

    return (
        <form
            onSubmit={handleSendMessage}
            className="sticky bottom-0 flex-none p-4 border-t border-gray-200 bg-white"
        >
            <div className="flex items-center space-x-3">
                <button
                    type="button"
                    className="p-2 text-gray-500 hover:bg-gray-700/10 rounded-full"
                >
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
                        if (typingTimeout.current) {
                            clearTimeout(typingTimeout.current);
                        }
                        typingTimeout.current = window.setTimeout(() => {
                            onTyping();
                        }, 1000);
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
    );
}