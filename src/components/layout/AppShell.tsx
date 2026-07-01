"use client";

import type { ReactNode } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthUnavailable from "@/components/states/AuthUnavailable";
import TopNav from "./TopNav";

interface AppShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

const AppShell = ({ children, footer }: AppShellProps) => {
  const { user, loading, isConfigured, error, login, logout } = useAuthContext();

  if (!isConfigured || error) {
    return <AuthUnavailable error={error ?? undefined} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav
        user={user}
        authLoading={loading}
        isAuthConfigured={isConfigured}
        onLogin={login}
        onLogout={logout}
      />
      <main>{children}</main>
      {footer}
    </div>
  );
};

export default AppShell;
