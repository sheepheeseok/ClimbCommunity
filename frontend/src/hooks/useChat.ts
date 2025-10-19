import { useEffect, useState, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { WS_BROKER_URL } from "@/utils/config";
import api from "@/lib/axios";

export interface ChatMessage {
    id?: number;
    type: "CHAT" | "IMAGE" | "VIDEO" | "TYPING";
    roomId: number;
    senderId: number;
    content: string;
    createdAt?: string;
}

export function useChat(roomId: number, myUserId: number, partnerId?: number) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUser, setTypingUser] = useState<number | null>(null);
    const clientRef = useRef<Client | null>(null);

    // ✅ roomId가 바뀌면 메시지 초기화
    useEffect(() => {
        setMessages([]);
        setTypingUser(null);
    }, [roomId]);

    // ✅ 초기 메시지 로딩
    useEffect(() => {
        if (!roomId) return;
        const fetchMessages = async () => {
            try {
                const res = await api.get<ChatMessage[]>(`/api/chats/${roomId}/messages`);
                setMessages(res.data);
            } catch (err) {
                console.error("메시지 불러오기 실패:", err);
            }
        };
        fetchMessages();
    }, [roomId]);

    // ✅ WebSocket 연결
    useEffect(() => {
        if (!roomId || !myUserId) return;

        const client = new Client({
            brokerURL: WS_BROKER_URL,
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            console.log("✅ WebSocket 연결 성공:", roomId);

            client.subscribe(`/topic/chat/${roomId}`, (frame: IMessage) => {
                const msg: ChatMessage = JSON.parse(frame.body);

                if (msg.type === "TYPING") {
                    if (msg.senderId !== myUserId) {
                        setTypingUser(msg.senderId);
                        setTimeout(() => setTypingUser(null), 2000);
                    }
                } else {
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
            if (client && client.active) {
                console.log("🔌 WebSocket 연결 해제:", roomId);
                client.deactivate();
            }
        };
    }, [roomId, myUserId]);

    // ✅ 메시지 전송
    const sendMessage = (
        content: string,
        type: "CHAT" | "IMAGE" | "VIDEO" = "CHAT"
    ) => {
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

        // 낙관적 업데이트 (보내자마자 바로 반영)
        if (type === "CHAT") {
            setMessages((prev) => [
                ...prev,
                { ...message, createdAt: new Date().toISOString() },
            ]);
        }
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

    // ✅ 파일 업로드 → 메시지 전송
    const sendFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("roomId", roomId.toString());
        formData.append("accountId", myUserId.toString());
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
