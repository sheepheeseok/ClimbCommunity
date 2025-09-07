import React from "react";

interface IconProps {
    className?: string;
    onClick?: () => void;
}

export const SaveIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
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
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

export const SaveIconFilled: React.FC<IconProps> = ({
                                                        className = "",
                                                        onClick,
                                                    }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#2563eb"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        onClick={onClick}
    >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);
