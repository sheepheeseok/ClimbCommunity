// src/hooks/useChat.ts
import { useEffect, useState, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { WS_BROKER_URL } from "@/utils/config";
import api from "@/lib/axios";

export interface ChatMessage {
    id?: number;
    type: "CHAT" | "IMAGE" | "VIDEO" | "TYPING";
    roomId: number;
    senderId: number;   // ✅ number로
    content: string;
    createdAt?: string;
}

export function useChat(roomId: number, myUserId: number, partnerId?: number) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUser, setTypingUser] = useState<number | null>(null);
    const clientRef = useRef<Client | null>(null);

    // 초기 메시지 로딩
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get<ChatMessage[]>(`/api/chats/${roomId}/messages`);
                setMessages(res.data);
            } catch (err) {
                console.error("메시지 불러오기 실패:", err);
            }
        };
        if (roomId) fetchMessages();
    }, [roomId]);

    // WebSocket 연결
    useEffect(() => {
        const client = new Client({
            brokerURL: WS_BROKER_URL,
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("✅ WebSocket 연결 성공:", roomId);

            client.subscribe(`/topic/chat/${roomId}`, (frame: IMessage) => {
                const msg: ChatMessage = JSON.parse(frame.body);

                if (msg.type === "TYPING") {
                    // 내가 보낸 typing은 무시, 상대방 것만 표시
                    if (msg.senderId !== myUserId) {
                        setTypingUser(msg.senderId);
                        setTimeout(() => setTypingUser(null), 2000);
                    }
                } else {
                    // 메시지가 오면 typing 상태 해제
                    setTypingUser(null);
                    setMessages((prev) => [...prev, msg]);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("❌ STOMP error:", frame.headers["message"], frame.body);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [roomId, myUserId]);

    // 메시지 전송
    const sendMessage = (content: string, type: "CHAT" | "IMAGE" | "VIDEO" = "CHAT") => {
        if (!clientRef.current || !clientRef.current.connected) return;

        const message: ChatMessage = {
            type,
            roomId,
            senderId: myUserId,
            content,
        };

        clientRef.current.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(message),
        });
    };

    // 입력중 이벤트 전송
    const sendTyping = () => {
        if (!clientRef.current || !clientRef.current.connected) return;

        const message: ChatMessage = {
            type: "TYPING",
            roomId,
            senderId: myUserId,
            content: "...",
        };

        clientRef.current.publish({
            destination: "/app/chat.typing",
            body: JSON.stringify(message),
        });
    };

    // 파일 업로드 → 메시지 전송
    const sendFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("roomId", roomId.toString());
        formData.append("accountId", myUserId.toString());   // ✅ 추가
        if (partnerId !== undefined) {
            formData.append("partnerId", partnerId.toString());
        }

        const res = await api.post("/api/chat/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const fileUrl = res.data;
        const type = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";

        sendMessage(fileUrl, type);
    };

    return {
        messages,
        typingUser,
        sendMessage,
        sendTyping,
        sendFile,
    };
}
