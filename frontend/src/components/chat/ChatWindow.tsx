import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageCircle } from "@/components/icons/MessageCircle";
import { TypingBubble } from "@/components/chat/TypingBubble";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "@/components/chat/ChatInput";
import { useKeyboardStatus } from "@/services/useKeyboardStatus";

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
    const keyboardOpen = useKeyboardStatus()

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

    const scrollLock = useRef(false);

    useEffect(() => {
        const el = messagesEndRef.current;
        if (!el) return;

        // ✅ 키보드 열려있으면 스크롤 잠금
        if (keyboardOpen) {
            scrollLock.current = true;
            return;
        }

        // ✅ 키보드 닫히면 잠금 해제
        scrollLock.current = false;

        const parent = el.parentElement;
        if (!parent) return;

        // ✅ iOS Safari 보정: ChatInput 높이만큼 padding 확보
        parent.style.paddingBottom = "80px"; // ChatInput 높이에 맞춰 조정 (60~100px 사이)

        const timeout = setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "end" });

            // ✅ 2차 보정: 입력창 높이 고려해 완전 하단으로 강제 이동
            setTimeout(() => {
                parent.scrollTop = parent.scrollHeight + 120; // 80 + 여유 40px
            }, 150);
        }, 200);

        return () => clearTimeout(timeout);
    }, [messages, typingUser, keyboardOpen]);


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
                    src={activeChat.profileImage ||  "/default-avatar.png" }
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
            <div className="flex-1 min-h-0 overflow-y-auto p-4 mb-[5rem] bg-gray-50 scroll-smooth"
             >
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
