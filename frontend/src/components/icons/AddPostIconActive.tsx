export function AddPostIconActive({ className }: { className?: string }) {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect x="2.5" y="2.5" width="20" height="20" rx="4" fill="white" stroke="black" strokeWidth="2"/>
            <path d="M7.5 12.5H17.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12.5 7.5L12.5 17.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
}