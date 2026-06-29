"use client";

import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import TopNav from "./TopNav";

interface AppShellProps {
  children: ReactNode;
  footer?: ReactNode;
  user?: User | null;
  authLoading?: boolean;
  isAuthConfigured?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const AppShell = ({
  children,
  footer,
  user,
  authLoading = false,
  isAuthConfigured = false,
  onLogin,
  onLogout,
}: AppShellProps) => (
  <div className="min-h-screen bg-black text-white">
    <TopNav
      user={user}
      authLoading={authLoading}
      isAuthConfigured={isAuthConfigured}
      onLogin={onLogin}
      onLogout={onLogout}
    />
    <main>{children}</main>
    {footer}
  </div>
);

export default AppShell;
