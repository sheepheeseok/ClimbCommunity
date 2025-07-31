export function AddPostIcon({ className }: { className?: string }) {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="2.5" width="20" height="20" rx="4" fill="white" stroke="black" stroke-width="2"/>
            <path d="M7.5 12.5H17.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
            <path d="M12.5 7.5L12.5 17.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
        </svg>
    )
}