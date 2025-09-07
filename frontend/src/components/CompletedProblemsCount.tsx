import React from "react";

interface CompletedProblemsProps {
    problems: Record<string, number>; // 객체 형태로 받음 (ex: { red: 2, black: 0 })
    className?: string;
}

// 색상 매핑 (Tailwind 또는 HEX로 변경 가능)
const colorMap: Record<string, string> = {
    black: "#000000",
    red: "#ef4444",    // Tailwind red-500
    purple: "#8b5cf6", // Tailwind purple-500
    brown: "#92400e",  // Tailwind yellow-800
    white: "#e5e7eb",  // Tailwind gray-200
};

const DifficultyCircle: React.FC<{ color: string; className?: string }> = ({
                                                                               color,
                                                                               className = "",
                                                                           }) => (
    <div
        className={`w-4 h-4 rounded-full ${className}`}
        style={{ backgroundColor: color }}
    />
);

const ProblemCountItem: React.FC<{
    difficulty: string;
    count: number;
    color: string;
}> = ({ difficulty, count, color }) => (
    <div className="flex items-center gap-1">
        <DifficultyCircle color={color} />
        <span className="font-bold text-sm text-gray-700">{count}</span>
    </div>
);

export const CompletedProblemsCount: React.FC<CompletedProblemsProps> = ({
                                                                             problems = {},
                                                                             className = "",
                                                                         }) => {
    // 객체 → 배열 변환 + 0개인 건 제외
    const problemArray = Object.entries(problems)
        .filter(([_, count]) => count > 0)
        .map(([difficulty, count]) => ({
            difficulty,
            count,
            color: colorMap[difficulty] || "#9ca3af", // fallback: gray-400
        }));

    if (!problemArray.length) return null;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-sm text-gray-500">완등한 문제:</span>
            {problemArray.map((problem, index) => (
                <ProblemCountItem
                    key={index}
                    difficulty={problem.difficulty}
                    count={problem.count}
                    color={problem.color}
                />
            ))}
        </div>
    );
};
