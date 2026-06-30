"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, CheckCircle2, Flame, FolderKanban, Play, Shuffle } from "lucide-react";
import dynamic from "next/dynamic";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import CompanyLogo from "@/components/data-display/CompanyLogo";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { ProgressRingChart } from "@/app/components/ProgressRingChart";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { Problem, UserProblemProgress } from "@/lib/progressTypes";

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

const computeStreak = (progressMap: Record<string, UserProblemProgress>): number => {
  const solvedDates = new Set<string>();
  for (const p of Object.values(progressMap)) {
    if (p.solved && p.solvedAt) {
      solvedDates.add(new Date(p.solvedAt.seconds * 1000).toISOString().slice(0, 10));
    }
  }
  if (solvedDates.size === 0) return 0;
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (solvedDates.has(d.toISOString().slice(0, 10))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const DashboardPage = () => {
  const router = useRouter();
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

  const recentSolved = useMemo(() => {
    const solved: { problem: Problem; date: Date }[] = [];
    for (const [problemId, p] of Object.entries(progress.progressMap)) {
      if (p.solved && p.solvedAt) {
        const problem = questionsState.questions.find((q) => q.problemId === problemId);
        if (problem) solved.push({ problem, date: new Date(p.solvedAt.seconds * 1000) });
      }
    }
    return solved.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [progress.progressMap, questionsState.questions]);

  const lastAttempted = useMemo(() => {
    const entries: { problem: Problem; progress: UserProblemProgress }[] = [];
    for (const p of Object.values(progress.progressMap)) {
      if (p.attempted && !p.solved && p.attemptedAt) {
        const q = questionsState.questions.find((q) => q.problemId === p.problemId);
        if (q) entries.push({ problem: q, progress: p });
      }
    }
    if (entries.length === 0) return null;
    entries.sort((a, b) => (b.progress.attemptedAt!.seconds * 1000) - (a.progress.attemptedAt!.seconds * 1000));
    return entries[0];
  }, [questionsState.questions, progress.progressMap]);

  const lastSolved = useMemo(() => {
    let last: { problem: Problem; date: Date } | null = null;
    for (const [problemId, p] of Object.entries(progress.progressMap)) {
      if (p.solved && p.solvedAt) {
        const d = new Date(p.solvedAt.seconds * 1000);
        if (!last || d > last.date) {
          const problem = questionsState.questions.find((q) => q.problemId === problemId);
          if (problem) last = { problem, date: d };
        }
      }
    }
    return last;
  }, [questionsState.questions, progress.progressMap]);

  const topCompanies = useMemo(() => {
    return stats.companyStats
      .filter((c) => c.solved > 0)
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 5);
  }, [stats.companyStats]);

  const ringSegments = useMemo(() => {
    const colorMap: Record<string, string> = { Easy: "#22c55e", Medium: "#eab308", Hard: "#ef4444" };
    return stats.difficultyStats.map((d) => ({
      name: d.name, total: d.total, solved: d.solved, color: colorMap[d.name] || "#6366f1",
    }));
  }, [stats.difficultyStats]);

  const difficultyColors: Record<string, string> = {
    Easy: "bg-green-500/20 border-green-500/30 text-green-400",
    Medium: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    Hard: "bg-red-500/20 border-red-500/30 text-red-400",
  };

  const difficultyBarColors: Record<string, string> = {
    Easy: "bg-green-500",
    Medium: "bg-yellow-500",
    Hard: "bg-red-500",
  };

  const isLoading = questionsState.loading || progress.loading;
  const hasError = questionsState.error || auth.error || progress.error;

  const quickActions = [
    { title: "Continue Solving", description: "Resume your last problem", href: "/problems", icon: Play },
    { title: "Random Problem", description: "Get a random challenge", href: "/problems", icon: Shuffle },
    { title: "My Lists", description: "Manage custom problem lists", href: "/my-lists", icon: FolderKanban },
    { title: "Progress", description: "Detailed stats and history", href: "/progress", icon: BarChart3 },
  ];

  const handleDifficultyClick = useCallback(() => {
    router.push("/progress");
  }, [router]);

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
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:px-6 lg:px-8">
        {isLoading && <LoadingState />}
        {hasError && <ErrorState message={hasError} />}

        {!isLoading && !hasError && (
          <>
            {/* Row 1: Profile Summary + Overall Progress */}
            <div className="grid gap-4 lg:grid-cols-3">
              <section className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
                <div className="flex flex-wrap items-center gap-5">
                  {auth.user ? (
                    <>
                      <Avatar className="size-14 border-2 border-green-500/30 shrink-0">
                        {auth.user.photoURL && <AvatarImage src={auth.user.photoURL} alt={auth.user.displayName ?? "User"} />}
                        <AvatarFallback className="bg-zinc-800 text-lg text-green-400">
                          {(auth.user.displayName || auth.user.email || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-white truncate">{auth.user.displayName || "User"}</h3>
                        <p className="text-sm text-zinc-400">{stats.total} problems in current dataset</p>
                        {streak > 0 && (
                          <div className="inline-flex items-center gap-1.5 rounded-md border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 mt-1.5">
                            <Flame className="size-4 text-orange-400" />
                            <span className="text-sm font-bold text-orange-300">{streak}</span>
                            <span className="text-xs text-zinc-400">day streak</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-6 text-center">
                        <div><div className="text-2xl font-bold text-green-400">{stats.solved}</div><div className="text-xs text-zinc-500">Solved</div></div>
                        <div><div className="text-2xl font-bold text-blue-400">{stats.attempted}</div><div className="text-xs text-zinc-500">Attempted</div></div>
                        <div><div className="text-2xl font-bold text-yellow-400">{stats.bookmarked}</div><div className="text-xs text-zinc-500">Bookmarked</div></div>
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
                      <div className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500" style={{ width: `${solvedPercent}%` }} />
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <ProgressRingChart
                      segments={ringSegments}
                      size={140}
                      strokeWidth={20}
                      onSegmentClick={handleDifficultyClick}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-white">{stats.solved}</span>
                      <span className="text-[10px] text-zinc-500 leading-tight">/ {stats.total}</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Progress</h3>
                    <div className="space-y-2 text-xs">
                      {ringSegments.map((s) => {
                        const pct = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
                        return (
                          <div key={s.name} className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">{s.name}</span>
                              <span className="text-zinc-200 font-medium tabular-nums">{s.solved}/{s.total}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Link href="/progress" className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 mt-2">
                      Full stats <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Row 2: Activity Heatmap */}
            <section>
              <Heatmap uid={auth.user?.uid} />
              {auth.user && (
                <div className="mt-1 text-right">
                  <Link href="/progress" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    View full history <ArrowRight className="size-3" />
                  </Link>
                </div>
              )}
            </section>

            {/* Row 3: Continue Solving + Recent Activity */}
            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Continue Solving</h3>
                {lastAttempted ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/15 text-green-400">
                        <Play className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-green-400 uppercase tracking-wider">Last Attempted</div>
                        <div className="mt-0.5 truncate text-sm font-semibold text-white">{lastAttempted.problem.title}</div>
                      </div>
                      <DifficultyBadge difficulty={lastAttempted.problem.difficulty} />
                    </div>
                    <Link href="/problems" className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                      Resume <ArrowRight className="size-3" />
                    </Link>
                  </div>
                ) : lastSolved ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/15 text-green-400">
                        <Play className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">Last Solved</div>
                        <div className="mt-0.5 truncate text-sm font-semibold text-white">{lastSolved.problem.title}</div>
                      </div>
                      <DifficultyBadge difficulty={lastSolved.problem.difficulty} />
                    </div>
                    <Link href="/problems" className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                      Solve another <ArrowRight className="size-3" />
                    </Link>
                  </div>
                ) : (
                  <Link href="/problems" className="group block">
                    <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-6 text-center transition-colors hover:border-zinc-600">
                      <p className="text-sm text-zinc-400">Start solving your first problem</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-green-400 group-hover:text-green-300">
                        Browse Problems <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                )}
                {lastSolved && lastAttempted && (
                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 className="size-3 text-green-400" />
                      Last solved: {formatRelativeTime(lastSolved.date)}
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Recent Activity</h3>
                  {recentSolved.length > 0 && (
                    <Link href="/progress" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all</Link>
                  )}
                </div>
                {recentSolved.length > 0 ? (
                  <ul className="space-y-2">
                    {recentSolved.map((entry) => (
                      <li key={entry.problem.problemId}>
                        <a
                          href={entry.problem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-800/50"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-white">{entry.problem.title}</div>
                            <div className="text-xs text-zinc-500">{formatRelativeTime(entry.date)}</div>
                          </div>
                          <DifficultyBadge difficulty={entry.problem.difficulty} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-6 text-center">
                    <p className="text-sm text-zinc-400">No solved problems yet</p>
                    <Link href="/problems" className="mt-2 inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                      Start solving <ArrowRight className="size-3" />
                    </Link>
                  </div>
                )}
              </section>
            </div>

            {/* Row 4: Difficulty Breakdown + Company Progress */}
            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Difficulty Breakdown</h3>
                {ringSegments.some((s) => s.solved > 0) ? (
                  <div className="space-y-3">
                    {ringSegments.map((seg) => {
                      const percent = seg.total > 0 ? Math.round((seg.solved / seg.total) * 100) : 0;
                      return (
                        <Link
                          key={seg.name}
                          href={`/progress`}
                          className={`block rounded-lg border p-3 transition-colors hover:opacity-80 ${difficultyColors[seg.name] || "bg-zinc-800/50 border-zinc-700 text-zinc-300"}`}
                        >
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-medium">{seg.name}</span>
                            <span>{seg.solved}/{seg.total} ({percent}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${difficultyBarColors[seg.name] || "bg-green-500"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">No solved problems yet</p>
                )}
              </section>

              <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Company Progress</h3>
                {topCompanies.length > 0 ? (
                  <div className="space-y-3">
                    {topCompanies.map((company) => {
                      const percent = company.total > 0 ? Math.round((company.solved / company.total) * 100) : 0;
                      return (
                        <Link
                          key={company.name}
                          href={`/problems`}
                          className="block rounded-lg border border-zinc-800 bg-zinc-950 p-3 transition-colors hover:bg-zinc-800/50"
                        >
                          <div className="flex items-center gap-3 mb-1.5">
                            <CompanyLogo company={company.name} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-zinc-200 truncate text-sm">{company.name}</span>
                                <span className="text-xs text-zinc-400 shrink-0 ml-2">{company.solved} solved</span>
                              </div>
                            </div>
                          </div>
                          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : stats.companyStats.length > 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">Start solving problems from different companies</p>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">No company data available</p>
                )}
              </section>
            </div>

            {/* Row 5: Quick Actions */}
            <section className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 text-center transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{action.title}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{action.description}</div>
                    </div>
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
