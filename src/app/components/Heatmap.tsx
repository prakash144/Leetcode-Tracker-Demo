"use client";

import { useHeatmapData } from "@/hooks/useHeatmapData";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";
import LoadingState from "@/components/states/LoadingState";

interface HeatmapProps {
    uid?: string | null;
}

const getCellColor = (count: number) => {
    if (count >= 6) return "bg-green-500";
    if (count >= 4) return "bg-green-600";
    if (count >= 2) return "bg-green-700";
    if (count >= 1) return "bg-green-900";
    return "bg-zinc-800";
};

const Heatmap = ({ uid }: HeatmapProps) => {
    const { days, loading, error } = useHeatmapData(uid);
    const hasActivity = days.some((day) => day.count > 0);

    return (
        <section className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-200">Activity</h2>
            </div>
            {error && <ErrorState message={error} />}
            {!uid && (
                <EmptyState message="Sign in to see your activity heatmap." />
            )}
            {uid && loading && <LoadingState message="Loading activity data..." />}
            {uid && !loading && !error && !hasActivity && (
                <EmptyState message="No activity yet. Solve or attempt a problem to start filling the heatmap." />
            )}
            {uid && !loading && (
            <>
            <div className="overflow-x-auto">
                <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
                    {days.map((day) => (
                        <div
                            key={day.date}
                            title={`${day.date}: ${day.count} activity`}
                            className={`h-3 w-3 rounded-sm ${getCellColor(day.count)}`}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                <span>Less</span>
                {[0, 1, 2, 4, 6].map((count) => (
                    <span
                        key={count}
                        aria-label={`${count} activity level`}
                        className={`h-3 w-3 rounded-sm ${getCellColor(count)}`}
                    />
                ))}
                <span>More</span>
            </div>
            </>
            )}
        </section>
    );
};

export default Heatmap;
