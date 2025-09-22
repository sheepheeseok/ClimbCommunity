// src/hooks/useChatList.ts
import { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { WS_BROKER_URL } from "@/utils/config";
import api from "@/lib/axios";
import {useAuth} from "@/hooks/useAuth";

interface ChatPreview {
    id: number; // roomId
    user: {
        id: string;
        name: string;
        username: string;
        avatar: string;
    };
    lastMessage: string;
    unreadCount: number;
    online: boolean;
}

export function useChatList(myUserId: string) {
    const { id } = useAuth();
    const [chatList, setChatList] = useState<ChatPreview[]>([]);
    const clientRef = useRef<Client | null>(null);

    // ✅ 초기 목록 불러오기
    useEffect(() => {
        if (!id) return; // 로그인 안 된 경우 방어 코드
        api.get(`/api/chats/${id}`).then((res) => {
            setChatList(res.data);
        });
    }, [id]);

    // ✅ WebSocket 연결 (한 번만 실행)
    useEffect(() => {
        if (chatList.length === 0) return; // 방 정보 없으면 skip

        const client = new Client({
            brokerURL: WS_BROKER_URL, // ws://EC2-IP:8080/ws
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("✅ ChatList WebSocket 연결 성공");

            // 모든 채팅방 구독
            chatList.forEach((chat) => {
                client.subscribe(`/topic/chat/${chat.id}`, (frame: IMessage) => {
                    const msg = JSON.parse(frame.body);

                    setChatList((prev) =>
                        prev.map((c) =>
                            c.id === msg.roomId
                                ? {
                                    ...c,
                                    lastMessage:
                                        msg.type === "CHAT"
                                            ? msg.content
                                            : msg.type === "IMAGE"
                                                ? "📷 이미지"
                                                : "🎥 동영상",
                                    unreadCount: c.unreadCount + 1,
                                }
                                : c
                        )
                    );
                });
            });
        };

        client.onStompError = (frame) => {
            console.error("❌ STOMP error:", frame.headers["message"], frame.body);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            console.log("ChatList WebSocket Disconnected");
        };
    }, [chatList.length]); // 방 개수 변경 시에만 재연결

    // ✅ 안읽은 메시지 초기화
    const markAsRead = (roomId: number) => {
        setChatList((prev) =>
            prev.map((c) => (c.id === roomId ? { ...c, unreadCount: 0 } : c))
        );
    };

    return { chatList, markAsRead };
}
