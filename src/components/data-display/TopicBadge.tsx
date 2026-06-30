interface TopicBadgeProps {
  topic: string;
  active?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-sm",
};

const TopicBadge = ({ topic, active = false, size = "sm", className = "" }: TopicBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-md font-medium transition-colors ${
      active
        ? "bg-blue-500 text-white"
        : "bg-zinc-800 text-zinc-300"
    } ${sizeMap[size]} ${className}`}
  >
    {topic}
  </span>
);

export default TopicBadge;
