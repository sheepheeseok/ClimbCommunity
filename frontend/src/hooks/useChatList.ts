// src/hooks/useChatList.ts
import { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { WS_BROKER_URL } from "@/utils/config";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export interface ChatPreview {
    roomId: number;
    user: {
        id: string;
        name: string;
        username: string;
        avatar: string;
    };
    lastMessage: string;
    unreadCount: number;
    online: boolean;
    timestamp?: string;
}

// ✅ 메시지 변환 함수
function formatLastMessage(type: string, content: string) {
    switch (type) {
        case "IMAGE":
            return "📷 이미지";
        case "VIDEO":
            return "🎥 동영상";
        default:
            return content;
    }
}

export function useChatList(myUserId: string) {
    const { id } = useAuth(); // 로그인 유저 PK
    const [chatList, setChatList] = useState<ChatPreview[]>([]);
    const clientRef = useRef<Client | null>(null);

    // ✅ 공통 fetch 함수
    const fetchChatList = async () => {
        try {
            if (!id) return;
            const res = await api.get(`/api/chats/${id}`);
            const mapped = res.data.map((chat: any) => ({
                ...chat,
                lastMessage: formatLastMessage(chat.type, chat.lastMessage),
                timestamp: chat.timestamp || new Date().toISOString(),
            }));

            mapped.sort(
                (a: any, b: any) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
            );

            setChatList(mapped);
        } catch (err) {
            console.error("❌ 채팅 목록 불러오기 실패:", err);
        }
    };

    // ✅ 초기 목록 불러오기
    useEffect(() => {
        fetchChatList();
    }, [id]);

    // ✅ WebSocket 연결
    useEffect(() => {
        if (chatList.length === 0) return;

        const client = new Client({
            brokerURL: WS_BROKER_URL,
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("✅ ChatList WebSocket 연결 성공");

            chatList.forEach((c) => {
                client.subscribe(`/topic/chat/${c.roomId}`, (frame: IMessage) => {
                    const msg = JSON.parse(frame.body);

                    if (msg.type === "TYPING") return;

                    setChatList((prev) => {
                        const updated = prev.map((chat) =>
                            chat.roomId === msg.roomId
                                ? {
                                    ...chat,
                                    lastMessage: formatLastMessage(
                                        msg.type,
                                        msg.content
                                    ),
                                    unreadCount:
                                        msg.senderId === id
                                            ? chat.unreadCount
                                            : chat.unreadCount + 1,
                                    timestamp:
                                        msg.createdAt ||
                                        new Date().toISOString(),
                                }
                                : chat
                        );

                        return [...updated].sort(
                            (a, b) =>
                                new Date(b.timestamp || 0).getTime() -
                                new Date(a.timestamp || 0).getTime()
                        );
                    });
                });
            });
        };

        client.onStompError = (frame) => {
            console.error(
                "❌ STOMP error:",
                frame.headers["message"],
                frame.body
            );
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            console.log("ChatList WebSocket Disconnected");
        };
    }, [chatList]); // ✅ 변경: length → 전체 chatList 감시

    // ✅ 안읽은 메시지 초기화
    const markAsRead = async (roomId: number) => {
        try {
            await api.patch(`/api/chats/${roomId}/read`, null, {
                params: { userId: myUserId },
            });

            setChatList((prev) =>
                prev.map((c) =>
                    c.roomId === roomId ? { ...c, unreadCount: 0 } : c
                )
            );
        } catch (err) {
            console.error("❌ 읽음 처리 실패:", err);
        }
    };

    // ✅ 외부에서 강제로 새로고침 가능
    const refreshChatList = () => {
        fetchChatList();
    };

    const unreadRooms = chatList.filter((c) => c.unreadCount > 0).length;

    return { chatList, markAsRead, unreadRooms, refreshChatList };
}
