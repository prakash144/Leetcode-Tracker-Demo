"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Clock, Filter } from "lucide-react";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import MetricCard from "@/components/data-display/MetricCard";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import TopicBreakdown from "@/features/analytics/components/TopicBreakdown";
import DifficultyBreakdown from "@/features/analytics/components/DifficultyBreakdown";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { Problem, UserProblemProgress } from "@/lib/progressTypes";

type ProgressEntry = {
  problem: Problem;
  progress: UserProblemProgress;
  lastAction: string;
  lastDate: Date;
};

const ProgressPage = () => {
  const { auth, progress, questionsState } = useProblemWorkspaceData();
  const stats = useDashboardStats(questionsState.questions, progress.progressMap);
  const [filter, setFilter] = useState<"all" | "solved" | "attempted">("all");
  const [search, setSearch] = useState("");

  const entries = useMemo(() => {
    const result: ProgressEntry[] = [];
    for (const [problemId, p] of Object.entries(progress.progressMap)) {
      if (!p.solved && !p.attempted) continue;
      const problem = questionsState.questions.find((q) => q.problemId === problemId);
      if (!problem) continue;
      const lastDate = p.solvedAt
        ? new Date(p.solvedAt.seconds * 1000)
        : p.attemptedAt
          ? new Date(p.attemptedAt.seconds * 1000)
          : new Date(p.updatedAt.seconds * 1000);
      result.push({
        problem,
        progress: p,
        lastAction: p.solved ? "Accepted" : "Attempted",
        lastDate,
      });
    }
    result.sort((a, b) => b.lastDate.getTime() - a.lastDate.getTime());
    return result;
  }, [progress.progressMap, questionsState.questions]);

  const filtered = useMemo(() => {
    let result = entries;
    if (filter === "solved") result = result.filter((e) => e.progress.solved);
    if (filter === "attempted") result = result.filter((e) => e.progress.attempted && !e.progress.solved);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.problem.title.toLowerCase().includes(q));
    }
    return result;
  }, [entries, filter, search]);

  const totalSubmissions = entries.length;
  const acceptedCount = entries.filter((e) => e.progress.solved).length;
  const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

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
        eyebrow="Progress"
        title="Practice History"
        description="Review your detailed coding history, submission stats, and progress trends."
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:px-6 lg:px-8 pb-12">
        {auth.error && <ErrorState message={auth.error} />}
        {progress.loading && <LoadingState message="Loading progress data..." />}

        {!auth.user && (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/70 px-4 py-12 text-center">
            <Clock className="mx-auto size-10 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-400">Sign in to track your practice history and progress.</p>
          </div>
        )}

        {auth.user && !progress.loading && (
          <>
            {/* Summary Panel */}
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard label="Solved" value={`${stats.solved}/${stats.total}`} />
                <MetricCard label="Acceptance" value={`${acceptanceRate}%`} />
                <MetricCard label="Submissions" value={totalSubmissions} />
                <MetricCard label="Streak" value={stats.solvedPercent > 0 ? `${stats.solvedPercent}%` : "—"} />
              </div>
              <div className="lg:col-span-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Difficulty</h3>
                <div className="space-y-2">
                  {stats.difficultyStats.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 capitalize">{d.name}</span>
                      <span className="text-zinc-200 font-medium">{d.solved}/{d.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
              <DifficultyBreakdown items={stats.difficultyStats} />
              <TopicBreakdown items={stats.topicStats} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Filter className="size-3.5" />
                Filter:
              </div>
              {(["all", "solved", "attempted"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-green-500/15 text-green-300"
                      : "text-zinc-400 hover:text-zinc-200 bg-zinc-800"
                  }`}
                >
                  {f === "all" ? "All" : f === "solved" ? "Accepted" : "Attempted"}
                </button>
              ))}
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-auto rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none w-48"
              />
            </div>

            {/* Practice History Table */}
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/70 px-4 py-12 text-center">
                <p className="text-sm text-zinc-400">
                  {entries.length === 0
                    ? "No practice history yet. Solve or attempt a problem to start tracking."
                    : "No entries match the current filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-sm text-left text-zinc-300" aria-label="Practice history">
                  <thead className="bg-zinc-900 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Problem</th>
                      <th className="px-4 py-3">Difficulty</th>
                      <th className="px-4 py-3">Result</th>
                      <th className="px-4 py-3">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry) => (
                      <tr
                        key={entry.problem.problemId}
                        className="border-b border-zinc-800 bg-zinc-900/50 transition-colors hover:bg-zinc-800/50"
                      >
                        <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
                          {entry.lastDate.toLocaleDateString("en", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <a
                            href={entry.problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-blue-400 transition-colors"
                          >
                            {entry.problem.title}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <DifficultyBadge difficulty={entry.problem.difficulty} />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium ${
                              entry.progress.solved ? "text-green-400" : "text-yellow-400"
                            }`}
                          >
                            {entry.progress.solved ? (
                              <CheckCircle2 className="size-3.5" />
                            ) : (
                              <Circle className="size-3.5" />
                            )}
                            {entry.lastAction}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">{entry.problem.company}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default ProgressPage;