import { RotateCcw, Star } from "lucide-react";

type StatusType = "solved" | "attempted" | "bookmarked" | "revision" | "unsolved";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
  className?: string;
}

const config: Record<StatusType, { label: string; icon?: typeof Star; activeClass: string }> = {
  solved: {
    label: "Solved",
    activeClass: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  attempted: {
    label: "Attempted",
    activeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  bookmarked: {
    label: "Saved",
    icon: Star,
    activeClass: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
  },
  revision: {
    label: "Revision",
    icon: RotateCcw,
    activeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  unsolved: {
    label: "Unsolved",
    activeClass: "bg-zinc-800 text-zinc-400 border-zinc-700",
  },
};

const sizeMap: Record<string, string> = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-sm",
};

const StatusBadge = ({ status, size = "sm", className = "" }: StatusBadgeProps) => {
  const { label, icon: Icon, activeClass } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${activeClass} ${sizeMap[size]} ${className}`}
    >
      {Icon && <Icon className="size-3" />}
      {label}
    </span>
  );
};

export default StatusBadge;
