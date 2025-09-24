import { createContext, useContext } from "react";
import { useChatList } from "@/hooks/useChatList";
import {useAuth} from "@/hooks/useAuth";

const ChatContext = createContext<any>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { id } = useAuth(); // ✅ 실제 로그인 유저 PK
    const { chatList, markAsRead, unreadRooms } = useChatList(String(id)); // ✅ 여기!
    return (
        <ChatContext.Provider value={{ chatList, markAsRead, unreadRooms }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);