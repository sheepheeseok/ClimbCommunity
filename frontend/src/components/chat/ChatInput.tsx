import {useState, useRef, useEffect} from "react";
import { Smile, Paperclip, Send } from "@/components/icons/ChatIcons";

interface Props {
    onSend: (message: string) => void;
    onTyping: () => void;
    onFileSend: (file: File) => void;
}

export function ChatInput({ onSend, onTyping, onFileSend }: Props) {
    const [newMessage, setNewMessage] = useState("");
    const typingTimeout = useRef<number | null>(null);
    const [bottomOffset, setBottomOffset] = useState(0);

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
            className="fixed bottom-0 left-0 right-0 flex-none border-t border-gray-200 bg-white z-50"
            style={{
                padding:
                    "0.75rem calc(env(safe-area-inset-left) + 0.75rem) calc(env(safe-area-inset-bottom) + 0.75rem) calc(env(safe-area-inset-right) + 0.75rem)",
            }}
        >
            <div className="flex items-center gap-2 sm:gap-3 w-full max-w-3xl mx-auto px-2">
                {/* 이모지 버튼 */}
                <button
                    type="button"
                    className="flex-shrink-0 p-2 text-gray-500 hover:bg-gray-700/10 rounded-full"
                >
                    <Smile className="w-5 h-5" />
                </button>

                {/* 파일 업로드 */}
                <label className="flex-shrink-0 p-2 text-gray-500 hover:bg-gray-700/10 rounded-full cursor-pointer">
                    <Paperclip className="w-5 h-5" />
                    <input type="file" hidden onChange={handleFileChange} />
                </label>

                {/* 메시지 입력창 */}
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
                    className="flex-1 min-w-0 px-3 py-3 text-black bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />

                {/* 전송 버튼 */}
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
}
