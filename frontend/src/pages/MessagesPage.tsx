// src/pages/MessagesPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChatList } from "@/hooks/useChatList";
import { useAuth } from "@/hooks/useAuth";

export function MessagesPage() {
    const { id: myUserId } = useAuth();   // 로그인 유저 PK
    const { roomId } = useParams<{ roomId?: string }>(); // ✅ URL 파라미터
    const { chatList, markAsRead } = useChatList(myUserId);
    const [activeChat, setActiveChat] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomId) {
            setActiveChat(null);
            return;
        }

        // chatList 아직 안 불러왔으면 아무 것도 하지 않음
        if (!chatList || chatList.length === 0) return;

        const chat = chatList.find((c) => String(c.roomId) === roomId);
        if (chat) {
            setActiveChat(chat);
        } else {
            // 정말 잘못된 roomId일 때만 이동
            navigate("/messages", { replace: true });
        }
    }, [roomId, chatList, navigate]);


    // ✅ roomId 바뀔 때마다 페이지 스크롤 맨 위로
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [roomId]);

    return (
        <div className="flex h-screen w-full"> {/* Header 64px 빼고 전체 */}
            {/* ✅ ChatList: 항상 고정, 스크롤 없음 */}
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

                        // ✅ 여기서 읽음 처리 실행
                        markAsRead(chat.roomId);
                    }}
                />
            </div>

            {/* ✅ ChatWindow: 내부만 overflow-y-auto */}
            <div className="flex-1 flex flex-col bg-white">
                {activeChat ? (
                    <ChatWindow activeChat={activeChat} myUserId={myUserId} markAsRead={markAsRead}/>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
                        채팅을 선택하세요
                    </div>
                )}
            </div>
        </div>
    );
}
