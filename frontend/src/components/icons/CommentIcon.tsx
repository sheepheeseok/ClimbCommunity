import React from "react";

interface IconProps {
    className?: string;
    onClick?: () => void;
}

export const CommentIcon: React.FC<IconProps> = ({
                                                     className = "",
                                                     onClick,
                                                 }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        onClick={onClick}
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
