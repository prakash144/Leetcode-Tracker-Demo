"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Bookmark, Flame, ListChecks, Play, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import Footer from "@/app/components/Footer";
import DashboardStats from "@/app/components/DashboardStats";
import AppShell from "@/components/layout/AppShell";

const Heatmap = dynamic(() => import("@/app/components/Heatmap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-6">
      <div className="mx-auto mb-4 h-3 max-w-xs overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-green-500" />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="size-3 rounded-sm bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
});
import PageHeader from "@/components/layout/PageHeader";
import MetricCard from "@/components/data-display/MetricCard";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { Problem, UserProblemProgress } from "@/lib/progressTypes";

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
    description: "Inspect completion, topic, difficulty, and activity trends.",
    href: "/analytics",
    icon: BarChart3,
    enabled: true,
  },
];

const computeStreak = (progressMap: Record<string, UserProblemProgress>): number => {
  const solvedDates = new Set<string>();
  for (const p of Object.values(progressMap)) {
    if (p.solved && p.solvedAt) {
      const d = new Date(p.solvedAt.seconds * 1000).toISOString().slice(0, 10);
      solvedDates.add(d);
    }
  }
  if (solvedDates.size === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (solvedDates.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const findLastAttempted = (
  questions: Problem[],
  progressMap: Record<string, UserProblemProgress>
): { problem: Problem; progress: UserProblemProgress } | null => {
  const entries: { problem: Problem; progress: UserProblemProgress }[] = [];
  for (const p of Object.values(progressMap)) {
    if (p.attempted && !p.solved && p.attemptedAt) {
      const q = questions.find((q) => q.problemId === p.problemId);
      if (q) entries.push({ problem: q, progress: p });
    }
  }
  if (entries.length === 0) return null;
  entries.sort((a, b) => {
    const ta = a.progress.attemptedAt!.seconds * 1000;
    const tb = b.progress.attemptedAt!.seconds * 1000;
    return tb - ta;
  });
  return entries[0];
};

const DashboardPage = () => {
  const { auth, progress, questionsState } = useProblemWorkspaceData();
  const stats = useDashboardStats(questionsState.questions, progress.progressMap);

  const solvedPercent = useMemo(() => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.solved / stats.total) * 100);
  }, [stats]);

  const streak = useMemo(
    () => (auth.user ? computeStreak(progress.progressMap) : 0),
    [auth.user, progress.progressMap]
  );

  const continueProblem = useMemo(
    () => findLastAttempted(questionsState.questions, progress.progressMap),
    [questionsState.questions, progress.progressMap]
  );

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

        {!questionsState.loading && !questionsState.error && (
          <>
            {/* Profile Summary */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
              <div className="flex flex-wrap items-center gap-5">
                {auth.user ? (
                  <>
                    <Avatar className="size-14 border-2 border-green-500/30">
                      {auth.user.photoURL && (
                        <AvatarImage src={auth.user.photoURL} alt={auth.user.displayName ?? "User"} />
                      )}
                      <AvatarFallback className="bg-zinc-800 text-lg text-green-400">
                        {(auth.user.displayName || auth.user.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {auth.user.displayName || "User"}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {stats.total} problems in current dataset
                      </p>
                    </div>
                    {streak > 0 && (
                      <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-2">
                        <Flame className="size-5 text-orange-400" />
                        <div className="text-sm">
                          <span className="font-bold text-orange-300">{streak}</span>
                          <span className="text-zinc-400 ml-1">day streak</span>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{stats.solved}</div>
                        <div className="text-xs text-zinc-500">Solved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{stats.attempted}</div>
                        <div className="text-xs text-zinc-500">Attempted</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{stats.bookmarked}</div>
                        <div className="text-xs text-zinc-500">Bookmarked</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cyan-400">{stats.revision}</div>
                        <div className="text-xs text-zinc-500">Revision</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-800 text-2xl">🎯</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Welcome to Interview Tracly</h3>
                      <p className="text-sm text-zinc-400">Sign in to track your progress and unlock insights.</p>
                    </div>
                  </>
                )}
              </div>

              {stats.total > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <span>Overall Progress</span>
                    <span>{solvedPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                      style={{ width: `${solvedPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard label="Progress" value={`${solvedPercent}%`} />
              <MetricCard label="Solved" value={`${stats.solved}/${stats.total}`} />
              <MetricCard label="Attempted" value={`${stats.attempted}/${stats.total}`} />
              <MetricCard label="Unsolved" value={stats.unsolved} />
              <MetricCard label="Bookmarked" value={stats.bookmarked} />
              <MetricCard label="Revision" value={stats.revision} />
            </div>

            {/* Continue Solving */}
            {continueProblem && (
              <Link href="/problems" className="group block">
                <section className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 transition-colors hover:border-green-500/40 hover:bg-green-500/10">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/15 text-green-400 group-hover:bg-green-500/20">
                      <Play className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-green-400 uppercase tracking-wider">Continue Solving</div>
                      <div className="mt-0.5 truncate text-sm font-semibold text-white">
                        {continueProblem.problem.title}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-400">
                      <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-medium capitalize">
                        {continueProblem.problem.difficulty}
                      </span>
                      <ArrowRight className="size-4 text-green-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </section>
              </Link>
            )}

            {/* Dashboard Stats (Difficulty, Company, Topics) */}
            <DashboardStats
              questions={questionsState.questions}
              progressMap={progress.progressMap}
            />

            {/* Activity Heatmap */}
            <Heatmap uid={auth.user?.uid} />

            {/* Quick Actions */}
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
          </>
        )}
      </div>
    </AppShell>
  );
};

export default DashboardPage;
