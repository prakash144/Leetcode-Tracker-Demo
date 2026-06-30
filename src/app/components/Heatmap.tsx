"use client";

import { useCallback, useMemo, useState } from "react";
import { useHeatmapData, type HeatmapDay } from "@/hooks/useHeatmapData";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";
import LoadingState from "@/components/states/LoadingState";

type TimeRange = "current" | "90d" | "30d";

const TIME_RANGES: { label: string; value: TimeRange }[] = [
    { label: "Current", value: "current" },
    { label: "90 Days", value: "90d" },
    { label: "30 Days", value: "30d" },
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const LEVELS = [0, 1, 2, 4, 6, 10];

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

const CELL = 12;
const GAP = 2;

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

interface HeatmapProps {
    uid?: string | null;
}

const Heatmap = ({ uid }: HeatmapProps) => {
    const { days: rawDays, loading, error } = useHeatmapData(uid);
    const [timeRange, setTimeRange] = useState<TimeRange>("current");
    const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

    const filteredDays = useMemo(() => {
        if (rawDays.length === 0) return [];
        const now = new Date();
        let cutoff: Date;
        switch (timeRange) {
            case "30d":
                cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "90d":
                cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                cutoff = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000);
                break;
        }
        const cutoffStr = cutoff.toISOString().slice(0, 10);
        return rawDays.filter((d) => d.date >= cutoffStr);
    }, [rawDays, timeRange]);

    const { weeks, monthLabels } = useMemo(() => buildCalendarData(filteredDays), [filteredDays]);
    const stats = useMemo(() => computeHeatmapStats(filteredDays), [filteredDays]);
    const hasActivity = filteredDays.some((day) => day.count > 0);

    const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

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

    return (
        <section className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h2 className="text-sm font-semibold text-zinc-200">Activity</h2>
                {uid && !loading && (
                    <div className="flex rounded-md border border-zinc-700 overflow-hidden">
                        {TIME_RANGES.map((tr) => (
                            <button
                                key={tr.value}
                                type="button"
                                onClick={() => setTimeRange(tr.value)}
                                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                                    timeRange === tr.value
                                        ? "bg-green-500/15 text-green-300 border-r border-zinc-700 last:border-r-0"
                                        : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-r border-zinc-700 last:border-r-0"
                                }`}
                            >
                                {tr.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary stats */}
            {uid && !loading && hasActivity && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-4 text-xs">
                    <div>
                        <span className="text-zinc-500">Submissions </span>
                        <span className="text-zinc-200 font-medium">{stats.totalSubmissions}</span>
                    </div>
                    <div>
                        <span className="text-zinc-500">Active days </span>
                        <span className="text-zinc-200 font-medium">{stats.activeDays}</span>
                    </div>
                    {stats.currentStreak > 0 && (
                        <div>
                            <span className="text-zinc-500">Streak </span>
                            <span className="text-green-400 font-medium">🔥 {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}</span>
                        </div>
                    )}
                    {stats.maxStreak > 1 && (
                        <div>
                            <span className="text-zinc-500">Best </span>
                            <span className="text-zinc-200 font-medium">{stats.maxStreak} days</span>
                        </div>
                    )}
                </div>
            )}

            {/* States */}
            {error && <ErrorState message={error} />}
            {!uid && (
                <EmptyState message="Sign in to see your activity heatmap." />
            )}
            {uid && loading && <LoadingState message="Loading activity data..." />}
            {uid && !loading && !error && !hasActivity && (
                <EmptyState message="No activity yet. Solve or attempt a problem to start filling the heatmap." />
            )}

            {/* Heatmap grid */}
            {uid && !loading && hasActivity && (
                <>
                    <div className="overflow-x-auto scrollbar-thin-dark">
                        <div className="inline-flex flex-col">
                            {/* Month labels */}
                            <div className="flex mb-1">
                                <div className="flex flex-col gap-0.5 mr-1.5" style={{ width: `${DAY_LABELS.reduce((w, l) => Math.max(w, l.length), 0) * 6 + 2}px` }} aria-hidden="true">
                                    {DAY_LABELS.map((_, i) => (
                                        <div key={i} style={{ height: `${CELL}px` }} />
                                    ))}
                                </div>
                                <div className="flex" style={{ gap: `${GAP}px` }}>
                                    {weeks.map((_, weekIdx) => {
                                        const ml = monthLabels.find((m) => m.weekIndex === weekIdx);
                                        return (
                                            <div
                                                key={weekIdx}
                                                className="relative shrink-0"
                                                style={{ width: `${CELL}px` }}
                                            >
                                                {ml && (
                                                    <span
                                                        className="absolute top-0 left-0 text-[10px] font-medium leading-none text-zinc-500 whitespace-nowrap pointer-events-none"
                                                        style={{ zIndex: 1 }}
                                                    >
                                                        {ml.label}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Grid body */}
                            <div className="flex">
                                <div
                                    className="flex flex-col mr-1.5"
                                    style={{ gap: `${GAP}px`, width: `${DAY_LABELS.reduce((w, l) => Math.max(w, l.length), 0) * 6 + 2}px` }}
                                >
                                    {DAY_LABELS.map((label, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center text-[10px] text-zinc-500 leading-none"
                                            style={{ height: `${CELL}px` }}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex" style={{ gap: `${GAP}px` }}>
                                    {weeks.map((week, weekIdx) => (
                                        <div key={weekIdx} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                                            {week.map((day) => {
                                                const isToday = day.date === todayStr;
                                                return (
                                                    <div
                                                        key={day.date}
                                                        title={`${new Date(day.date).toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}: ${getCellLabel(day.count)}`}
                                                        aria-label={`${new Date(day.date).toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}: ${getCellLabel(day.count)}`}
                                                        className={`rounded-sm cursor-pointer shrink-0 ${getCellColor(day.count)} ${isToday ? "ring-1 ring-green-300 ring-offset-[1.5px] ring-offset-zinc-900" : ""}`}
                                                        style={{ width: `${CELL}px`, height: `${CELL}px` }}
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

                    {/* Legend */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                            <span>Less</span>
                            {LEVELS.map((count) => (
                                <span
                                    key={count}
                                    aria-label={`${count} activity level`}
                                    className={`rounded-sm ${getCellColor(count)}`}
                                    style={{ width: `${CELL}px`, height: `${CELL}px` }}
                                />
                            ))}
                            <span>More</span>
                        </div>
                    </div>

                    {/* Tooltip */}
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
