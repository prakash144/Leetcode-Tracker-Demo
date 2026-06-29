"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getUserActivity,
  type DailyActivity,
} from "@/services/firebase/progressService";

export interface HeatmapDay {
  date: string;
  count: number;
}

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const buildYearDays = () => {
  const days: HeatmapDay[] = [];
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 364);

  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    days.push({
      date: toDateKey(date),
      count: 0,
    });
  }

  return days;
};

export const useHeatmapData = (uid?: string | null) => {
  const [activity, setActivity] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadActivity = async () => {
      if (!uid) {
        setActivity([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const nextActivity = await getUserActivity(uid);

        if (!cancelled) {
          setActivity(nextActivity);
        }
      } catch (activityError) {
        if (!cancelled) {
          setError(
            activityError instanceof Error
              ? activityError.message
              : "Unable to load activity."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  const days = useMemo(() => {
    const activityByDate = new Map(
      activity.map((day) => [day.date, day.solvedCount + day.attemptedCount])
    );

    return buildYearDays().map((day) => ({
      ...day,
      count: activityByDate.get(day.date) ?? 0,
    }));
  }, [activity]);

  return {
    days,
    loading,
    error,
  };
};
