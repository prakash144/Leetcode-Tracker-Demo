"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import type { Problem, ProgressMap, UserProblemProgress } from "@/lib/progressTypes";
import {
  getUserProgress,
  saveProblemProgress,
} from "@/services/firebase/progressService";

const emptyProgress = (problemId: string): UserProblemProgress => ({
  problemId,
  solved: false,
  attempted: false,
  bookmarked: false,
  inRevisionList: false,
  notes: "",
  solvedAt: null,
  attemptedAt: null,
  bookmarkedAt: null,
  revisionAddedAt: null,
  updatedAt: Timestamp.now(),
});

export const useProblemProgress = (uid?: string | null) => {
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!uid) {
        setProgressMap({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const progress = await getUserProgress(uid);

        if (!cancelled) {
          setProgressMap(progress);
        }
      } catch (progressError) {
        if (!cancelled) {
          setError(
            progressError instanceof Error
              ? progressError.message
              : "Unable to load progress."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  const updateProgress = useCallback(
    async (
      problem: Problem,
      updater: (current: UserProblemProgress) => UserProblemProgress
    ) => {
      if (!uid) {
        return;
      }

      const current = progressMap[problem.problemId] ?? emptyProgress(problem.problemId);
      const next = updater(current);

      setProgressMap((previous) => ({
        ...previous,
        [problem.problemId]: next,
      }));

      try {
        await saveProblemProgress(uid, next);
      } catch (progressError) {
        setProgressMap((previous) => ({
          ...previous,
          [problem.problemId]: current,
        }));
        setError(
          progressError instanceof Error
            ? progressError.message
            : "Unable to save progress."
        );
      }
    },
    [progressMap, uid]
  );

  const toggleSolved = useCallback(
    (problem: Problem) =>
      updateProgress(problem, (current) => {
        const solved = !current.solved;
        const now = Timestamp.now();

        return {
          ...current,
          solved,
          attempted: solved ? true : current.attempted,
          solvedAt: solved ? now : null,
          attemptedAt: solved && !current.attemptedAt ? now : current.attemptedAt,
          updatedAt: now,
        };
      }),
    [updateProgress]
  );

  const toggleAttempted = useCallback(
    (problem: Problem) =>
      updateProgress(problem, (current) => {
        const attempted = !current.attempted;
        const now = Timestamp.now();

        return {
          ...current,
          attempted,
          attemptedAt: attempted ? now : null,
          updatedAt: now,
        };
      }),
    [updateProgress]
  );

  const toggleBookmarked = useCallback(
    (problem: Problem) =>
      updateProgress(problem, (current) => {
        const bookmarked = !current.bookmarked;
        const now = Timestamp.now();

        return {
          ...current,
          bookmarked,
          bookmarkedAt: bookmarked ? now : null,
          updatedAt: now,
        };
      }),
    [updateProgress]
  );

  const toggleRevision = useCallback(
    (problem: Problem) =>
      updateProgress(problem, (current) => {
        const inRevisionList = !current.inRevisionList;
        const now = Timestamp.now();

        return {
          ...current,
          inRevisionList,
          revisionAddedAt: inRevisionList ? now : null,
          updatedAt: now,
        };
      }),
    [updateProgress]
  );

  const saveNotes = useCallback(
    (problem: Problem, notes: string) =>
      updateProgress(problem, (current) => ({
        ...current,
        notes,
        updatedAt: Timestamp.now(),
      })),
    [updateProgress]
  );

  return useMemo(
    () => ({
      progressMap,
      loading,
      error,
      toggleSolved,
      toggleAttempted,
      toggleBookmarked,
      toggleRevision,
      saveNotes,
    }),
    [
      error,
      loading,
      progressMap,
      saveNotes,
      toggleAttempted,
      toggleBookmarked,
      toggleRevision,
      toggleSolved,
    ]
  );
};
