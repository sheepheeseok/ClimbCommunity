import React from "react";

interface IconProps {
    className?: string;
    onClick?: () => void;
}

export const ShareIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
    <svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="currentColor" // ✅ currentColor로 변경
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={onClick}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.9488 3.05246L3.50014 8.99996L8.97999 12.1716L13.8119 7.33837C14.057 7.09343 14.3894 6.9559 14.7359 6.95602C15.0825 6.95614 15.4147 7.09391 15.6597 7.33902C15.9046 7.58414 16.0421 7.91651 16.042 8.26303C16.0419 8.60955 15.9041 8.94182 15.659 9.18676L10.8258 14.02L14 19.4986L19.9488 3.05246ZM20.3708 0.121158C21.9318 -0.444462 23.4445 1.06821 22.8788 2.62922L15.9791 21.7075C15.4121 23.2724 13.2751 23.4631 12.4403 22.0223L8.23802 14.762L0.977704 10.5597C-0.463126 9.72495 -0.272409 7.58787 1.29252 7.02094L20.3708 0.121158Z"
        />
    </svg>
);
