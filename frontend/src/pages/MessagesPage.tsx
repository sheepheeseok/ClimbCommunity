// src/pages/MessagesPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChat } from "@/data/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { ChatPreview } from "@/hooks/useChatList";

export function MessagesPage() {
    const { id: myUserId } = useAuth();   // 로그인 유저 PK
    const { roomId } = useParams<{ roomId?: string }>(); // ✅ URL 파라미터
    const { chatList, markAsRead } = useChat();
    const [activeChat, setActiveChat] = useState<ChatPreview | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomId) {
            setActiveChat(null);
            return;
        }

        if (!chatList || chatList.length === 0) return;

        const chat = chatList.find((c: ChatPreview) => String(c.roomId) === roomId);
        if (chat) {
            setActiveChat(chat);
        } else {
            navigate("/messages", { replace: true });
        }
    }, [roomId, chatList, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [roomId]);

    return (
        <div className="flex h-screen w-full overflow-hidden"> {/* ✅ 전체 고정, 내부만 스크롤 */}

            {/* ✅ ChatList: 좌측 고정, 내부 스크롤 */}
            <div
                className={`${
                    roomId ? "hidden md:flex" : "flex"
                } w-80 shrink-0 border-r border-gray-200 bg-white`}
            >
                <ChatList
                    conversations={chatList}
                    activeChat={activeChat}
                    onChatSelect={(chat) => {
                        if (!chat?.roomId) return;
                        setActiveChat(chat);
                        navigate(`/messages/${chat.roomId}`);
                        markAsRead(chat.roomId);
                    }}
                />
            </div>

            {/* ✅ ChatWindow: 내부 스크롤 */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                {activeChat ? (
                    <ChatWindow
                        activeChat={activeChat}
                        myUserId={myUserId}
                        markAsRead={markAsRead}
                    />
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
                        채팅을 선택하세요
                    </div>
                )}
            </div>
        </div>
    );
}
