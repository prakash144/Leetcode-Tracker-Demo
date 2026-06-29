"use client";

import { useHeatmapData } from "@/hooks/useHeatmapData";

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
    const { days, loading } = useHeatmapData(uid);

    return (
        <section className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-200">Activity</h2>
                {loading && <span className="text-xs text-zinc-500">Loading...</span>}
            </div>
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
        </section>
    );
};

export default Heatmap;
