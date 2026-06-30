"use client";

import type { User } from "firebase/auth";
import { LogIn, LogOut } from "lucide-react";
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
        <DropdownMenuItem
          disabled={loading}
          onClick={onLogout}
          className="cursor-pointer hover:bg-zinc-800"
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
