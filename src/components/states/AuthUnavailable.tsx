"use client";

import { ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthUnavailableProps {
  error?: string;
}

export default function AuthUnavailable({ error }: AuthUnavailableProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
          <ShieldAlert className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Authentication Unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {error || "Sign-in and cloud sync are not available on this instance."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Set the required <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">NEXT_PUBLIC_FIREBASE_*</code> environment variables to enable authentication.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
