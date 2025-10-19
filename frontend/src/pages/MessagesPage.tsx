// src/pages/MessagesPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChat } from "@/data/ChatContext";
import { useAuth } from "@/hooks/useAuth";
import { ChatPreview } from "@/hooks/useChatList";
import api from "@/lib/axios";

export function MessagesPage() {
    const { id: myUserId } = useAuth();   // 로그인 유저 PK
    const { roomId } = useParams<{ roomId?: string }>(); // ✅ URL 파라미터
    const { chatList, markAsRead } = useChat();
    const [activeChat, setActiveChat] = useState<ChatPreview | null>(null);
    const navigate = useNavigate();

    // ✅ body 스크롤 막기
    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);


    useEffect(() => {
        // ✅ roomId가 없으면 activeChat 초기화
        if (!roomId) {
            setActiveChat(null);
            return;
        }

        // ✅ chatList가 아직 로드 중이면 대기
        if (!chatList || chatList.length === 0) return;

        // ✅ 로드 완료 시 roomId 매칭
        const chat = chatList.find((c: ChatPreview) => String(c.roomId) === roomId);

        if (chat) {
            setActiveChat(chat);
        } else {
            // ✅ fallback: 서버에서 직접 방 정보 가져오기
            (async () => {
                try {
                    const res = await api.get(`/api/chats/${roomId}`);
                    if (res.data) {
                        setActiveChat(res.data);
                    }
                } catch (err) {
                    console.warn(`채팅방(${roomId})을 불러올 수 없습니다.`);
                    navigate("/messages", { replace: true });
                }
            })();
        }
    }, [roomId, chatList]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [roomId]);

    return (
        <div className="flex h-screen"> {/* ✅ 전체 고정, 내부만 스크롤 */}

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
                    }}
                />
            </div>

            {/* ✅ ChatWindow: 내부 스크롤 */}
            <div className="flex-1 flex flex-col">
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
