"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "firebase/auth";
import { BarChart3, Bookmark, LayoutDashboard, ListChecks, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "./UserMenu";

interface TopNavProps {
  user?: User | null;
  authLoading?: boolean;
  isAuthConfigured?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    label: "Problems",
    href: "/problems",
    icon: ListChecks,
    enabled: true,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    enabled: true,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: Bookmark,
    enabled: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    enabled: true,
  },
];

const TopNav = ({
  user,
  authLoading = false,
  isAuthConfigured = false,
  onLogin,
  onLogout,
}: TopNavProps) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-base" role="img" aria-label="Interview Tracly">
              🎯
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                Interview Tracly
              </div>
              <div className="hidden text-xs text-zinc-500 sm:block">
                Master Coding Interviews
              </div>
            </div>
          </Link>

          <UserMenu
            user={user}
            loading={authLoading}
            isConfigured={isAuthConfigured}
            onLogin={onLogin}
            onLogout={onLogout}
          />
        </div>

        <nav aria-label="Primary navigation" className="flex gap-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const className = cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
              isActive
                ? "border-green-500/40 bg-green-500/10 text-green-300"
                : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100",
              !item.enabled && "cursor-not-allowed opacity-50 hover:border-transparent hover:bg-transparent hover:text-zinc-400"
            );

            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  className={className}
                  aria-disabled="true"
                  title={`${item.label} will be added in a later phase`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={className}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
