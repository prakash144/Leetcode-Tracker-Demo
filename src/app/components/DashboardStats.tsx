"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { Problem, ProgressMap } from "@/lib/progressTypes";

interface DashboardStatsProps {
    questions: Problem[];
    progressMap: ProgressMap;
}

type DashboardStatsValue = ReturnType<typeof useDashboardStats>;

const StatPill = ({ label, value }: { label: string; value: string | number }) => (
    <div className="bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700">
        <div className="text-xs text-zinc-400">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
    </div>
);

const ProgressList = ({
                          title,
                          items,
                      }: {
    title: string;
    items: DashboardStatsValue["difficultyStats"];
}) => (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-zinc-200 mb-3">{title}</h2>
        <div className="space-y-2">
            {items.length === 0 && (
                <div className="text-sm text-zinc-500">No data</div>
            )}
            {items.map((item) => {
                const percent = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0;

                return (
                    <div key={item.name}>
                        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                            <span>{item.name}</span>
                            <span>{item.solved}/{item.total}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                                className="h-full bg-green-500"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const DashboardStats = ({ questions, progressMap }: DashboardStatsProps) => {
    const stats = useDashboardStats(questions, progressMap);

    return (
        <section className="space-y-4 mb-4">
            <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
                <StatPill label="Progress" value={`${stats.solvedPercent}%`} />
                <StatPill label="Solved" value={`${stats.solved}/${stats.total}`} />
                <StatPill label="Attempted" value={`${stats.attempted}/${stats.total}`} />
                <StatPill label="Unsolved" value={stats.unsolved} />
                <StatPill label="Bookmarked" value={stats.bookmarked} />
                <StatPill label="Revision" value={stats.revision} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <ProgressList title="Difficulty" items={stats.difficultyStats} />
                <ProgressList title="Company" items={stats.companyStats} />
                <ProgressList title="Topics" items={stats.topicStats} />
            </div>
        </section>
    );
};

export default DashboardStats;
