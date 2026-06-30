import { memo } from "react";

interface CompanyBadgeProps {
  company: string;
  size?: "sm" | "md";
  className?: string;
}

const BADGE_COLORS = [
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "bg-rose-500/20 text-rose-300 border-rose-500/30",
];

const hashColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length];
};

const sizeMap: Record<string, string> = {
  sm: "size-5 text-[10px]",
  md: "size-7 text-xs",
};

const CompanyBadge = memo(function CompanyBadge({
  company,
  size = "sm",
  className = "",
}: CompanyBadgeProps) {
  if (!company) return null;

  const initial = company.charAt(0).toUpperCase();
  const color = hashColor(company);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-semibold shrink-0 ${color} ${sizeMap[size]} ${className}`}
      title={company}
      aria-label={company}
    >
      {initial}
    </span>
  );
});

export default CompanyBadge;
