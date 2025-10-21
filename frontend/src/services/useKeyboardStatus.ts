import { useEffect, useState } from "react";

export function useKeyboardStatus() {
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    useEffect(() => {
        const threshold = 100;
        let lastHeight = window.visualViewport?.height || window.innerHeight;

        const handleResize = () => {
            const newHeight = window.visualViewport?.height || window.innerHeight;
            const diff = lastHeight - newHeight;

            // diff가 양수면 키보드가 열렸다고 판단
            if (diff > threshold) {
                setKeyboardOpen(true);
            } else if (diff < -threshold) {
                setKeyboardOpen(false);
            }

            lastHeight = newHeight;
        };

        const handleFocus = () => setKeyboardOpen(true);
        const handleBlur = () => setTimeout(() => setKeyboardOpen(false), 300);

        window.visualViewport?.addEventListener("resize", handleResize);
        window.addEventListener("focusin", handleFocus);
        window.addEventListener("focusout", handleBlur);

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.removeEventListener("focusin", handleFocus);
            window.removeEventListener("focusout", handleBlur);
        };
    }, []);

    return keyboardOpen;
}
