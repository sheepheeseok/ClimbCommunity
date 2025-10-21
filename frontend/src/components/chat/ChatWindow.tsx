import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageCircle } from "@/components/icons/MessageCircle";
import { TypingBubble } from "@/components/chat/TypingBubble";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "@/components/chat/ChatInput";

interface Props {
    activeChat: any;
    myUserId: number;
    markAsRead: (roomId: number) => void;
}

export function ChatWindow({ activeChat, myUserId, markAsRead }: Props) {
    const { messages, typingUser, sendMessage, sendTyping, sendFile } = useChat(
        activeChat.roomId,
        myUserId,
        activeChat.partnerId
    );

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!messagesEndRef.current || !activeChat) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && activeChat.unreadCount > 0) {
                markAsRead(activeChat.roomId);
            }
        });

        observer.observe(messagesEndRef.current);
        return () => observer.disconnect();
    }, [messages, activeChat, markAsRead]);

    useEffect(() => {
        if (!messagesEndRef.current) return;

        if (messages.length === 0) {
            const parent = messagesEndRef.current.parentElement;
            if (parent) parent.scrollTop = 0;
        } else {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages, typingUser]);

    if (!activeChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        메시지를 선택하세요
                    </h3>
                    <p className="text-gray-500">
                        대화를 시작하려면 왼쪽에서 채팅을 선택하세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex-none p-4 border-b border-gray-200 flex items-center space-x-3 bg-white z-10">
                <img
                    src={activeChat.profileImage}
                    alt={activeChat.username}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {activeChat.username}님
                    </h3>
                    <p className="text-xs text-gray-500">{activeChat.partnerUserId}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} myUserId={myUserId} />
                ))}

                {typingUser && (
                    <div className="flex justify-start mt-2">
                        <TypingBubble />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ✅ ChatInput: safe-area-padding 적용된 버전 */}
            <ChatInput
                onSend={(msg) => sendMessage(msg, "CHAT")}
                onTyping={sendTyping}
                onFileSend={sendFile}
            />
        </div>
    );
}
