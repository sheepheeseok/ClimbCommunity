// src/pages/MessagesPage.tsx
import { useEffect, useState } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChatList } from "@/hooks/useChatList";
import { useAuth } from "@/hooks/useAuth";

export function MessagesPage() {
    const { id: myUserId } = useAuth();   // DB PK 기준
    const { chatList, markAsRead } = useChatList(myUserId);
    const [activeChat, setActiveChat] = useState<any | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChatSelect = (chat: any) => {
        setActiveChat(chat);
        markAsRead(chat.id);
    };

    return (
        <div className="flex h-screen w-full">
            {/* ✅ ChatList */}
            <div className="hidden md:flex w-80 shrink-0 border-r border-gray-200">
                <ChatList
                    conversations={chatList}
                    activeChat={activeChat}
                    onChatSelect={handleChatSelect}
                />
            </div>

            {/* ✅ ChatWindow */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <ChatWindow activeChat={activeChat} myUserId={String(myUserId)} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        채팅을 선택하세요
                    </div>
                )}
            </div>
        </div>
    );
}
