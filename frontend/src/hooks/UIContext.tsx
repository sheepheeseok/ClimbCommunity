import { createContext, useContext, useState } from "react";

const UIContext = createContext<any>(null);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    return (
        <UIContext.Provider
            value={{
                isSearchOpen,
                setIsSearchOpen,
                isNotificationOpen,
                setIsNotificationOpen,
            }}
        >
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
