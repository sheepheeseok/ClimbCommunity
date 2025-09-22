// src/hooks/useChat.ts
import { useEffect, useState, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { WS_BROKER_URL } from "@/utils/config";
import api from "@/lib/axios";

export interface ChatMessage {
    id?: number;
    type: "CHAT" | "IMAGE" | "VIDEO" | "TYPING";
    roomId: number;
    senderId: string;
    content: string;
}

export function useChat(roomId: number, myUserId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const clientRef = useRef<Client | null>(null);

    // ✅ WebSocket 연결
    useEffect(() => {
        const client = new Client({
            brokerURL: WS_BROKER_URL, // 예: ws://13.208.176.244:8080/ws
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("✅ WebSocket 연결 성공:", roomId);

            client.subscribe(`/topic/chat/${roomId}`, (frame: IMessage) => {
                const msg: ChatMessage = JSON.parse(frame.body);

                if (msg.type === "TYPING" && msg.senderId !== myUserId) {
                    setTypingUser(msg.senderId);
                    setTimeout(() => setTypingUser(null), 2000);
                } else {
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

    // ✅ 메시지 전송
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

    // ✅ 입력중 이벤트 전송
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

    // ✅ 파일 업로드 → WebSocket 메시지 전송
    const sendFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("roomId", roomId.toString());
        formData.append("senderId", myUserId);

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
