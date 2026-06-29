"use client";

import { useMemo } from "react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";

interface NamedCount {
  name: string;
  total: number;
  solved: number;
  attempted: number;
}

const sortBySolvedThenTotal = (a: NamedCount, b: NamedCount) =>
  b.solved - a.solved || b.total - a.total || a.name.localeCompare(b.name);

export const useDashboardStats = (
  questions: Problem[],
  progressMap: ProgressMap
) =>
  useMemo(() => {
    const uniqueProblems = new Map<string, Problem>();

    questions.forEach((question) => {
      if (!uniqueProblems.has(question.problemId)) {
        uniqueProblems.set(question.problemId, question);
      }
    });

    const problems = Array.from(uniqueProblems.values());
    const total = problems.length;
    let solved = 0;
    let attempted = 0;
    let bookmarked = 0;
    let revision = 0;

    const difficultyStats = new Map<string, NamedCount>();
    const topicStats = new Map<string, NamedCount>();
    const companyStats = new Map<string, NamedCount>();

    const ensureStat = (map: Map<string, NamedCount>, name: string) => {
      const key = name || "Unknown";
      const existing = map.get(key);

      if (existing) {
        return existing;
      }

      const next = { name: key, total: 0, solved: 0, attempted: 0 };
      map.set(key, next);
      return next;
    };

    problems.forEach((problem) => {
      const progress = progressMap[problem.problemId];
      const isSolved = Boolean(progress?.solved);
      const isAttempted = Boolean(progress?.attempted);

      if (isSolved) solved += 1;
      if (isAttempted) attempted += 1;
      if (progress?.bookmarked) bookmarked += 1;
      if (progress?.inRevisionList) revision += 1;

      const difficulty = ensureStat(difficultyStats, problem.difficulty);
      difficulty.total += 1;
      if (isSolved) difficulty.solved += 1;
      if (isAttempted) difficulty.attempted += 1;

      const company = ensureStat(companyStats, problem.company);
      company.total += 1;
      if (isSolved) company.solved += 1;
      if (isAttempted) company.attempted += 1;

      const topics = problem.topics.length > 0 ? problem.topics : ["Unknown"];
      topics.forEach((topicName) => {
        const topic = ensureStat(topicStats, topicName);
        topic.total += 1;
        if (isSolved) topic.solved += 1;
        if (isAttempted) topic.attempted += 1;
      });
    });

    return {
      total,
      solved,
      attempted,
      bookmarked,
      revision,
      unsolved: Math.max(total - solved, 0),
      solvedPercent: total > 0 ? Math.round((solved / total) * 100) : 0,
      attemptedPercent: total > 0 ? Math.round((attempted / total) * 100) : 0,
      difficultyStats: Array.from(difficultyStats.values()).sort(sortBySolvedThenTotal),
      topicStats: Array.from(topicStats.values()).sort(sortBySolvedThenTotal).slice(0, 8),
      companyStats: Array.from(companyStats.values()).sort(sortBySolvedThenTotal),
    };
  }, [questions, progressMap]);
