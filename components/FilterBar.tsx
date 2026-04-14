import React from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["ALL", "FURNITURE", "GARDEN", "KIDS", "KITCHEN", "DECORATION"];
const DIFFICULTIES = ["ALL", "EASY", "MEDIUM", "HARD"];

export default function FilterBar({
  activeCategory,
  onCategoryChange,
  activeDifficulty,
  onDifficultyChange
}: {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  activeDifficulty: string;
  onDifficultyChange: (diff: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h4 className="font-black text-sm mb-3 uppercase tracking-wider underline decoration-2 underline-offset-4">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "border-2 border-black px-3 py-1 text-[10px] font-black transition-all uppercase tracking-tighter",
                activeCategory === cat 
                  ? "bg-[#FFE500] shadow-[2px_2px_0px_black] translate-x-[-1px] translate-y-[-1px]" 
                  : "bg-white hover:bg-[#FFE500]/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-black text-sm mb-3 uppercase tracking-wider underline decoration-2 underline-offset-4">Difficulty</h4>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={cn(
                "border-2 border-black px-3 py-1 text-[10px] font-black transition-all uppercase tracking-tighter",
                activeDifficulty === diff 
                  ? "bg-[#FFE500] shadow-[2px_2px_0px_black] translate-x-[-1px] translate-y-[-1px]" 
                  : "bg-white hover:bg-[#FFE500]/30"
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
