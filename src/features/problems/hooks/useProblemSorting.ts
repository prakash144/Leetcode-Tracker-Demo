"use client";

import { useMemo, useState } from "react";
import type { Problem } from "@/lib/progressTypes";

export type ProblemSortField = "acceptanceRate" | "frequency";
export type SortDirection = "asc" | "desc";

export interface ProblemSortState {
  sortBy: ProblemSortField | null;
  sortDirection: SortDirection;
}

const parseAcceptanceRate = (value: Problem["acceptanceRate"]) =>
  typeof value === "number" ? value : parseFloat(value);

export const sortProblems = (
  problems: Problem[],
  { sortBy, sortDirection }: ProblemSortState
) => {
  const sorted = [...problems];

  if (!sortBy) {
    return sorted;
  }

  sorted.sort((a, b) => {
    const comparison =
      sortBy === "acceptanceRate"
        ? parseAcceptanceRate(a.acceptanceRate) -
          parseAcceptanceRate(b.acceptanceRate)
        : a.frequency.localeCompare(b.frequency);

    return sortDirection === "asc" ? comparison : -comparison;
  });

  return sorted;
};

export const useProblemSorting = (problems: Problem[]) => {
  const [sortBy, setSortBy] = useState<ProblemSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedProblems = useMemo(
    () => sortProblems(problems, { sortBy, sortDirection }),
    [problems, sortBy, sortDirection]
  );

  const handleSort = (column: ProblemSortField) => {
    if (sortBy === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortDirection("asc");
  };

  return {
    sortedProblems,
    sortBy,
    sortDirection,
    handleSort,
  };
};
