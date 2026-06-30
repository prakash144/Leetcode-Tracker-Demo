import { memo, type ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

const MetricCard = memo(function MetricCard({
  label,
  value,
  icon,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 transition-colors hover:border-zinc-600 ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <div className="text-xs text-zinc-400">{label}</div>
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
});

export default MetricCard;
