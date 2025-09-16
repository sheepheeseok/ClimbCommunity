import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import {WS_BROKER_URL} from "@/utils/config";

type SubscriptionConfig = {
    destination: string;              // 구독 경로 
    handler: (msg: IMessage) => void; // 메시지 처리 함수
};

export function useWebSocket(subscriptions: SubscriptionConfig[]) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            brokerURL: WS_BROKER_URL, // ✅ EC2 퍼블릭 IP + 포트 + /ws
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"), // ✅ 직접 토큰 넣기
            },
            reconnectDelay: 5000,                    // 자동 재연결
            // debug: (str) => {
            //     console.log("📡 STOMP DEBUG:", str);
            // },
        });

        client.onConnect = () => {
            console.log("✅ WebSocket 연결 성공");
            subscriptions.forEach(({ destination, handler }) => {
                client.subscribe(destination, handler);
            });
        };

        client.onStompError = (frame) => {
            console.error("❌ Broker error:", frame.headers["message"], frame.body);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [subscriptions]);
}
