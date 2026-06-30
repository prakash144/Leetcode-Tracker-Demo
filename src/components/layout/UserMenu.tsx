"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "firebase/auth";
import { FolderKanban, LogIn, LogOut, Moon, Settings, Sun, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user?: User | null;
  loading?: boolean;
  isConfigured?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const getFallback = (user?: User | null) =>
  user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U";

const UserMenu = ({
  user,
  loading = false,
  isConfigured = false,
  onLogin,
  onLogout,
}: UserMenuProps) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!user) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading || !isConfigured}
        onClick={onLogin}
        className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
        title={!isConfigured ? "Firebase Auth is not configured." : "Sign in with Google"}
        aria-label={!isConfigured ? "Firebase Auth is not configured. Sign in unavailable." : "Sign in with Google"}
      >
        <LogIn className="size-4" />
        {loading ? "Checking..." : "Sign in"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-10 gap-3 px-2 text-left text-zinc-200 hover:bg-zinc-900 hover:text-white"
          aria-label="Open user menu"
        >
          <Avatar className="size-8 border border-zinc-700">
            {user.photoURL && (
              <AvatarImage src={user.photoURL} alt={user.displayName ?? "User"} />
            )}
            <AvatarFallback className="bg-zinc-800 text-xs text-white">
              {getFallback(user).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm md:inline">
            {user.displayName || user.email || "Account"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-zinc-700 bg-zinc-900 text-white">
        <DropdownMenuLabel>
          <div className="truncate text-sm font-medium">
            {user.displayName || "Signed in"}
          </div>
          {user.email && (
            <div className="truncate text-xs font-normal text-zinc-400">{user.email}</div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-800">
          <Link href="/settings" className="flex items-center gap-3">
            <UserIcon className="size-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-800">
          <Link href="/my-lists" className="flex items-center gap-3">
            <FolderKanban className="size-4" />
            My Lists
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-800">
          <Link href="/settings" className="flex items-center gap-3">
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={toggleTheme}
          className="cursor-pointer hover:bg-zinc-800"
        >
          {theme === "dark" ? (
            <span className="flex items-center gap-3">
              <Sun className="size-4" />
              Light Mode
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <Moon className="size-4" />
              Dark Mode
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          disabled={loading}
          onClick={onLogout}
          className="cursor-pointer hover:bg-zinc-800"
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
