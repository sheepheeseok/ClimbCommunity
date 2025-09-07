interface DifficultyIconProps {
    color: string;
}

export default function DifficultyIcon({ color }: DifficultyIconProps) {
    return (
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center shadow`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
        </div>
    );
}
