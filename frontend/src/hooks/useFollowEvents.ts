// src/hooks/useFollowEvents.ts
import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import {WS_BROKER_URL} from "@/utils/config";

export type FollowEvent = {
    followerId: string;
    following: boolean; // true = follow, false = unfollow
};

type Props = {
    userId: string; // 내가 보고 있는 대상 (ex. 게시물 작성자, 프로필 주인)
    onFollowEvent: (event: FollowEvent) => void; // 이벤트 처리 콜백
};

export function useFollowEvents({ userId, onFollowEvent }: Props) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!userId) return;

        const client = new Client({
            brokerURL: WS_BROKER_URL,
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            reconnectDelay: 5000,
            debug: (str) => console.log("📡 [FollowEvents]", str),
        });

        client.onConnect = () => {
            console.log("✅ WebSocket 연결 성공 (FollowEvents)");
            client.subscribe(`/topic/follow-events/${userId}`, (msg: IMessage) => {
                try {
                    const data: FollowEvent = JSON.parse(msg.body);
                    onFollowEvent(data);
                } catch (e) {
                    console.error("❌ FollowEvent parse error", e);
                }
            });
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [userId, onFollowEvent]);
}
