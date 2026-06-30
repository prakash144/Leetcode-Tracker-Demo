"use client";

import Link from "next/link";
import type { User } from "firebase/auth";
import { FolderKanban, LogIn, LogOut, Settings, User as UserIcon } from "lucide-react";
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
        className="border-border bg-card text-card-foreground hover:bg-accent hover:text-foreground"
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
          className="h-10 gap-3 px-2 text-left text-card-foreground hover:bg-card hover:text-foreground"
          aria-label="Open user menu"
        >
          <Avatar className="size-8 border border-border">
            {user.photoURL && (
              <AvatarImage src={user.photoURL} alt={user.displayName ?? "User"} />
            )}
            <AvatarFallback className="bg-secondary text-xs text-foreground">
              {getFallback(user).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm md:inline">
            {user.displayName || user.email || "Account"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-border bg-card text-foreground">
        <DropdownMenuLabel>
          <div className="truncate text-sm font-medium">
            {user.displayName || "Signed in"}
          </div>
          {user.email && (
            <div className="truncate text-xs font-normal text-muted-foreground">{user.email}</div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-secondary" />
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
          <Link href="/settings" className="flex items-center gap-3">
            <UserIcon className="size-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
          <Link href="/my-lists" className="flex items-center gap-3">
            <FolderKanban className="size-4" />
            My Lists
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
          <Link href="/settings" className="flex items-center gap-3">
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-secondary" />
        <DropdownMenuItem
          disabled={loading}
          onClick={onLogout}
          className="cursor-pointer hover:bg-accent"
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
