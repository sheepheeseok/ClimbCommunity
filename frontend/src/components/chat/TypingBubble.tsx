// src/components/chat/TypingBubble.tsx
export function TypingBubble() {
    return (
        <div className="flex items-center space-x-1 px-4 py-2 bg-gray-200 rounded-2xl max-w-[8rem]">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
        </div>
    );
}
