"use client";

import { useCallback, useMemo, useState } from "react";
import { useHeatmapData, type HeatmapDay } from "@/hooks/useHeatmapData";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";
import LoadingState from "@/components/states/LoadingState";

interface HeatmapProps {
    uid?: string | null;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const getCellColor = (count: number) => {
    if (count >= 10) return "bg-green-400";
    if (count >= 6) return "bg-green-500";
    if (count >= 4) return "bg-green-600";
    if (count >= 2) return "bg-green-700";
    if (count >= 1) return "bg-green-900";
    return "bg-zinc-800";
};

const getCellLabel = (count: number) => {
    if (count === 0) return "No activity";
    return `${count} ${count === 1 ? "submission" : "submissions"}`;
};

interface CalendarData {
    weeks: HeatmapDay[][];
    monthLabels: { label: string; weekIndex: number }[];
}

const buildCalendarData = (days: HeatmapDay[]): CalendarData => {
    if (days.length === 0) return { weeks: [], monthLabels: [] };

    const startDate = new Date(days[0].date);
    const startDay = startDate.getDay();
    const paddedDays: HeatmapDay[] = [];

    if (startDay > 0) {
        const padStart = new Date(startDate);
        padStart.setDate(padStart.getDate() - startDay);
        for (let i = 0; i < startDay; i++) {
            const d = new Date(padStart);
            d.setDate(d.getDate() + i);
            paddedDays.push({ date: d.toISOString().slice(0, 10), count: 0 });
        }
    }

    const allDays = [...paddedDays, ...days];

    const weeks: HeatmapDay[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7));
    }

    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = "";

    weeks.forEach((week, idx) => {
        const anchor = week[3] || week[0];
        if (!anchor) return;
        const month = new Date(anchor.date).toLocaleString("en", { month: "short" });
        if (month !== lastMonth) {
            monthLabels.push({ label: month, weekIndex: idx });
            lastMonth = month;
        }
    });

    return { weeks, monthLabels };
};

const computeHeatmapStats = (days: HeatmapDay[]) => {
    const today = new Date().toISOString().slice(0, 10);
    const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date));

    const totalSubmissions = days.reduce((sum, d) => sum + d.count, 0);
    const activeDays = days.filter((d) => d.count > 0).length;

    let currentStreak = 0;
    for (const day of sorted) {
        if (day.date > today) continue;
        if (day.count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    let maxStreak = 0;
    let streak = 0;
    for (const day of sorted) {
        if (day.date > today) continue;
        if (day.count > 0) {
            streak++;
            maxStreak = Math.max(maxStreak, streak);
        } else {
            streak = 0;
        }
    }

    return { totalSubmissions, activeDays, currentStreak, maxStreak };
};

const Heatmap = ({ uid }: HeatmapProps) => {
    const { days, loading, error } = useHeatmapData(uid);
    const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

    const { weeks, monthLabels } = useMemo(() => buildCalendarData(days), [days]);
    const stats = useMemo(() => computeHeatmapStats(days), [days]);
    const hasActivity = days.some((day) => day.count > 0);

    const handleMouseEnter = useCallback(
        (day: HeatmapDay, e: React.MouseEvent) => {
            if (day.count === 0) return;
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setTooltip({
                date: new Date(day.date).toLocaleDateString("en", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                count: day.count,
                x: rect.left + rect.width / 2,
                y: rect.top - 8,
            });
        },
        []
    );

    const handleMouseLeave = useCallback(() => {
        setTooltip(null);
    }, []);

    const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

    return (
        <section className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-200">Activity</h2>
                {uid && !loading && stats.activeDays > 0 && (
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span>{stats.totalSubmissions} submissions</span>
                        <span>{stats.activeDays} active days</span>
                        {stats.currentStreak > 0 && (
                            <span className="text-green-400">
                                🔥 {stats.currentStreak}-day streak
                            </span>
                        )}
                        {stats.maxStreak > 1 && (
                            <span>Best: {stats.maxStreak} days</span>
                        )}
                    </div>
                )}
            </div>

            {error && <ErrorState message={error} />}
            {!uid && (
                <EmptyState message="Sign in to see your activity heatmap." />
            )}
            {uid && loading && <LoadingState message="Loading activity data..." />}
            {uid && !loading && !error && !hasActivity && (
                <EmptyState message="No activity yet. Solve or attempt a problem to start filling the heatmap." />
            )}
            {uid && !loading && hasActivity && (
                <>
                    <div className="overflow-x-auto scrollbar-thin-dark">
                        <div className="relative inline-flex flex-col">
                            <div className="flex gap-0.5 ml-8 mb-1">
                                {weeks.map((_, weekIdx) => {
                                    const ml = monthLabels.find((m) => m.weekIndex === weekIdx);
                                    return (
                                        <div
                                            key={weekIdx}
                                            className="text-[10px] font-medium leading-none text-zinc-500 truncate"
                                            style={{ width: "12px" }}
                                        >
                                            {ml ? ml.label : ""}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex">
                                <div className="flex flex-col gap-0.5 mr-1.5 pt-0.5">
                                    {DAY_LABELS.map((label, i) => (
                                        <div
                                            key={i}
                                            className="flex h-3 items-center text-[10px] text-zinc-500 leading-none"
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-0.5">
                                    {weeks.map((week, weekIdx) => (
                                        <div key={weekIdx} className="flex flex-col gap-0.5">
                                            {week.map((day) => {
                                                const isToday = day.date === todayStr;
                                                return (
                                                    <div
                                                        key={day.date}
                                                        title={`${new Date(day.date).toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}: ${getCellLabel(day.count)}`}
                                                        aria-label={`${new Date(day.date).toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}: ${getCellLabel(day.count)}`}
                                                        className={`h-3 w-3 rounded-sm ${getCellColor(day.count)} ${isToday ? "ring-1 ring-green-300 ring-offset-[1.5px] ring-offset-zinc-900" : ""} cursor-pointer`}
                                                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                                                        onMouseLeave={handleMouseLeave}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <span>Less</span>
                            {[0, 1, 2, 4, 6, 10].map((count) => (
                                <span
                                    key={count}
                                    aria-label={`${count} activity level`}
                                    className={`h-3 w-3 rounded-sm ${getCellColor(count)}`}
                                />
                            ))}
                            <span>More</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {stats.currentStreak > 0 && (
                                <span className="text-green-400">
                                    🔥 Current streak: {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
                                </span>
                            )}
                            {stats.maxStreak > 1 && (
                                <span>Best streak: {stats.maxStreak} days</span>
                            )}
                        </div>
                    </div>

                    {tooltip && (
                        <div
                            className="fixed z-50 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white shadow-lg pointer-events-none"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y,
                                transform: "translate(-50%, -100%)",
                            }}
                        >
                            <div className="font-medium">{tooltip.date}</div>
                            <div className="text-zinc-400">{getCellLabel(tooltip.count)}</div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default Heatmap;
