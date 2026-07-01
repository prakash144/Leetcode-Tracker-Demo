"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-7 shrink-0", className)}
      aria-hidden="true"
    >
      {/* Background */}
      <rect
        x="0.5"
        y="0.5"
        width="27"
        height="27"
        rx="6"
        className="stroke-[var(--accent-color,#22c55e)] fill-[var(--accent-color,#22c55e)]/10"
        strokeWidth="1"
      />
      {/* I */}
      <rect x="8" y="7" width="3" height="14" rx="1.5" className="fill-[var(--accent-color,#22c55e)]" />
      {/* T */}
      <rect x="14" y="7" width="3" height="9" rx="1.5" className="fill-[var(--accent-color,#22c55e)]" />
      <rect x="14" y="7" width="9" height="3" rx="1.5" className="fill-[var(--accent-color,#22c55e)]" />
      {/* Code bracket accent */}
      <path
        d="M5 11l-2 3 2 3"
        className="stroke-[var(--accent-color,#22c55e)]"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M23 11l2 3-2 3"
        className="stroke-[var(--accent-color,#22c55e)]"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function Logo({ className, showTagline = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Interview Tracly - Home"
    >
      <LogoMark className="transition-transform duration-200 group-hover:scale-105" />
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-foreground">
          Interview Tracly
        </span>
        {showTagline && (
          <span className="hidden lg:inline text-xs text-muted-foreground">
            Track your journey. Crack your dream company. 🚀
          </span>
        )}
      </div>
    </Link>
  );
}

export { Logo, LogoMark };
export type { LogoProps };
