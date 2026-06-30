import { memo } from "react";

interface DifficultyBadgeProps {
  difficulty: string;
  size?: "sm" | "md";
  className?: string;
}

const colorMap: Record<string, string> = {
  easy: "text-green-400 bg-green-400/10 border-green-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

const sizeMap: Record<string, string> = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-sm",
};

const DifficultyBadge = memo(function DifficultyBadge({
  difficulty,
  size = "sm",
  className = "",
}: DifficultyBadgeProps) {
  const color = colorMap[difficulty.toLowerCase()] ?? "text-zinc-400 bg-zinc-800 border-zinc-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${color} ${sizeMap[size]} ${className}`}
    >
      {difficulty}
    </span>
  );
});

export default DifficultyBadge;
