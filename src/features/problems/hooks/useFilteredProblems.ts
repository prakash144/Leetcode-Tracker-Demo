"use client";

import { useMemo } from "react";
import type { Problem } from "@/lib/progressTypes";

export interface ProblemFilters {
  difficulty?: string;
  selectedTopics?: string[];
  searchTerm?: string;
}

export const matchesProblemFilters = (
  problem: Problem,
  { difficulty = "", selectedTopics = [], searchTerm = "" }: ProblemFilters
) => {
  const normalizedDifficulty = difficulty.toLowerCase();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const normalizedProblemTopics = problem.topicTag
    .split(",")
    .map((tag) => tag.trim().toLowerCase());

  const matchesDifficulty = normalizedDifficulty
    ? problem.difficulty.toLowerCase() === normalizedDifficulty
    : true;

  const matchesTopics =
    selectedTopics.length === 0 ||
    selectedTopics.some((topic) =>
      normalizedProblemTopics.includes(topic.toLowerCase())
    );

  const matchesSearch =
    normalizedSearch === "" ||
    problem.title.toLowerCase().includes(normalizedSearch);

  return matchesDifficulty && matchesTopics && matchesSearch;
};

export const filterProblems = (problems: Problem[], filters: ProblemFilters) =>
  problems.filter((problem) => matchesProblemFilters(problem, filters));

export const useFilteredProblems = (
  problems: Problem[],
  filters: ProblemFilters
) => {
  const { difficulty, searchTerm, selectedTopics } = filters;

  return useMemo(
    () => filterProblems(problems, { difficulty, searchTerm, selectedTopics }),
    [difficulty, problems, searchTerm, selectedTopics]
  );
};
