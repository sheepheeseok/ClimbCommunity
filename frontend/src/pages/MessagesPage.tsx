import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChat } from "@/data/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { ChatPreview } from "@/hooks/useChatList";
import api from "@/lib/axios";

export function MessagesPage() {
    const { id: myUserId } = useAuth(); // 로그인 유저 PK
    const { roomId } = useParams<{ roomId?: string }>(); // ✅ URL 파라미터
    const { chatList, markAsRead } = useChat();
    const [activeChat, setActiveChat] = useState<ChatPreview | null>(null);
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
    const navigate = useNavigate();

    // ✅ iOS Safari 대응: vh 대신 실제 window.innerHeight 사용
    useEffect(() => {
        const handleResize = () => setViewportHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ body 스크롤 막기
    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

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
            (async () => {
                try {
                    const res = await api.get(`/api/chats/${roomId}`);
                    if (res.data) setActiveChat(res.data);
                } catch {
                    navigate("/messages", { replace: true });
                }
            })();
        }
    }, [roomId, chatList]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [roomId]);

    return (
        <div
            className="flex flex-col md:flex-row w-full bg-white"
            style={{
                height: viewportHeight, // ✅ iOS Safari 대응
            }}
        >
            {/* ✅ ChatList: 모바일에서는 숨기기 */}
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
                    }}
                />
            </div>

            {/* ✅ ChatWindow */}
            <div className="flex-1 flex flex-col min-h-0">
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
