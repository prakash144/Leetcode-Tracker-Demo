"use client";

import DashboardStats from "@/app/components/DashboardStats";
import Heatmap from "@/app/components/Heatmap";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { Problem, ProgressMap } from "@/lib/progressTypes";
import DifficultyBreakdown from "./DifficultyBreakdown";
import TopicBreakdown from "./TopicBreakdown";

interface AnalyticsOverviewProps {
  questions: Problem[];
  progressMap: ProgressMap;
  uid?: string | null;
  loading?: boolean;
  error?: string | null;
}

const AnalyticsOverview = ({
  questions,
  progressMap,
  uid,
  loading = false,
  error,
}: AnalyticsOverviewProps) => {
  const stats = useDashboardStats(questions, progressMap);

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-4 sm:px-6 lg:px-8">
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="text-sm font-semibold uppercase tracking-wide text-green-400">
          Current dataset scope
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Analytics are calculated from the currently loaded company/list
          dataset and your matching progress records. Cross-company lifetime
          analytics can be added later by loading broader metadata.
        </p>
      </div>

      <DashboardStats questions={questions} progressMap={progressMap} />

      <div className="grid gap-4 lg:grid-cols-2">
        <DifficultyBreakdown items={stats.difficultyStats} />
        <TopicBreakdown items={stats.topicStats} />
      </div>

      <Heatmap uid={uid} />
    </section>
  );
};

export default AnalyticsOverview;
