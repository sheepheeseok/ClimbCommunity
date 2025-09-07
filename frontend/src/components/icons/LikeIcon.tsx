import React from "react";

interface IconProps {
    className?: string;
    onClick?: () => void;
}

export const LikeIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} cursor-pointer`}
        onClick={onClick}
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

export const LikeIconFilled: React.FC<IconProps> = ({
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
        className={`${className} cursor-pointer`}
        onClick={onClick}
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
