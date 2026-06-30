"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Bookmark, ListChecks, RotateCcw } from "lucide-react";
import Footer from "@/app/components/Footer";
import DashboardStats from "@/app/components/DashboardStats";
import Heatmap from "@/app/components/Heatmap";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { Button } from "@/components/ui/button";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

const quickActions = [
  {
    title: "Open Problems",
    description: "Search, filter, sort, and update progress from the dedicated workspace.",
    href: "/problems",
    icon: ListChecks,
    enabled: true,
  },
  {
    title: "Review Favorites",
    description: "Review your bookmarked problems from the dedicated favorites view.",
    href: "/favorites",
    icon: Bookmark,
    enabled: true,
  },
  {
    title: "View Analytics",
    description: "Dedicated analytics are planned after the problems workspace split.",
    href: "/analytics",
    icon: BarChart3,
    enabled: false,
  },
];

const DashboardPage = () => {
  const { auth, progress, questionsState } = useProblemWorkspaceData();

  return (
    <AppShell
      user={auth.user}
      authLoading={auth.loading}
      isAuthConfigured={auth.isConfigured}
      onLogin={auth.login}
      onLogout={auth.logout}
      footer={<Footer />}
    >
      <PageHeader
        eyebrow="Dashboard"
        title="Progress Overview"
        description="Track your journey. Crack your dream company. 🚀"
        actions={
          <Button
            asChild
            className="bg-green-500 text-black hover:bg-green-400"
          >
            <Link href="/problems">
              Open Problems
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:px-6 lg:px-8">
        {questionsState.loading && <LoadingState />}
        {questionsState.error && <ErrorState message={questionsState.error} />}
        {auth.error && <ErrorState message={auth.error} />}
        {progress.error && <ErrorState message={progress.error} />}

        <DashboardStats
          questions={questionsState.questions}
          progressMap={progress.progressMap}
        />

        <Heatmap uid={auth.user?.uid} />

        <section className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const content = (
              <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-zinc-800 text-green-300">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-base font-semibold text-white">{action.title}</h2>
                <p className="mt-2 flex-1 text-sm text-zinc-400">{action.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-green-300">
                  {action.enabled ? "Go to workspace" : "Coming later"}
                  {action.enabled ? (
                    <ArrowRight className="size-4" />
                  ) : (
                    <RotateCcw className="size-4" />
                  )}
                </div>
              </div>
            );

            if (!action.enabled) {
              return (
                <div key={action.href} aria-disabled="true" className="opacity-70">
                  {content}
                </div>
              );
            }

            return (
              <Link key={action.href} href={action.href}>
                {content}
              </Link>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
};

export default DashboardPage;
