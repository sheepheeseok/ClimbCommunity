import { useState } from "react";
import { HoldIconLv1, HoldIconLv2, HoldIconLv3, HoldIconLv4, HoldIconLv5, HoldIconLv6, HoldIconLv7 } from "@/components/icons/index";

const holdIcons = [HoldIconLv1, HoldIconLv2, HoldIconLv3, HoldIconLv4, HoldIconLv5, HoldIconLv6, HoldIconLv7];

interface HoldCountSelectorProps {
  label: string; // "시도 문제 수" or "완등 문제 수"
  initialCounts?: number[];
  onChange?: (counts: number[]) => void;
}

export default function HoldCountSelector({ label, initialCounts = Array(7).fill(0), onChange }: HoldCountSelectorProps) {
  const [counts, setCounts] = useState(initialCounts);

  const updateCount = (index: number, value: number) => {
    const newCounts = [...counts];
    newCounts[index] = Math.max(0, value); // 음수 방지
    setCounts(newCounts);
    if (onChange) onChange(newCounts);
  };

  return (
    <div>
      <p className="font-semibold text-sm mb-2">{label}</p>
      <div className="grid grid-cols-7 gap-1">
        {holdIcons.map((Icon, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <Icon className="w-6 h-6" />
            <div className="flex flex-col items-center">
              <input
                type="number"
                className="w-10 text-center border rounded"
                value={counts[idx]}
                onChange={(e) => updateCount(idx, parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
