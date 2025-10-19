// src/data/ChatContext.tsx
import { createContext, useContext } from "react";
import { useChatList } from "@/hooks/useChatList";
import { useAuth } from "@/hooks/useAuth";

const ChatContext = createContext<any>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { id } = useAuth(); // 로그인 유저 PK
    const { chatList, markAsRead, unreadRooms, refreshChatList } = useChatList(String(id));

    return (
        <ChatContext.Provider
            value={{ chatList, markAsRead, unreadRooms, refreshChatList }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
