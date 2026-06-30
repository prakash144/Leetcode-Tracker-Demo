"use client";

import { RotateCcw, Star } from "lucide-react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";
import NotesDialog from "@/app/components/NotesDialog";

interface ProblemCardListProps {
  problems: Problem[];
  startIndex: number;
  progressMap: ProgressMap;
  progressEnabled: boolean;
  onRequireAuth: () => void;
  onToggleSolved: (problem: Problem) => void;
  onToggleAttempted: (problem: Problem) => void;
  onToggleBookmarked: (problem: Problem) => void;
  onToggleRevision: (problem: Problem) => void;
  onSaveNotes: (problem: Problem, notes: string) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy": return "text-green-400 bg-green-400/10 border-green-400/20";
    case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    case "hard": return "text-red-400 bg-red-400/10 border-red-400/20";
    default: return "text-zinc-400 bg-zinc-800 border-zinc-700";
  }
};

const ProblemCardList = ({
  problems,
  startIndex,
  progressMap,
  progressEnabled,
  onRequireAuth,
  onToggleSolved,
  onToggleAttempted,
  onToggleBookmarked,
  onToggleRevision,
  onSaveNotes,
}: ProblemCardListProps) => {
  const requireProgressOrRun = (action: () => void) => {
    if (!progressEnabled) {
      onRequireAuth();
      return;
    }
    action();
  };

  return (
    <div className="space-y-3">
      {problems.map((q, idx) => {
        const progress = progressMap[q.problemId];
        const isSolved = Boolean(progress?.solved);
        const isAttempted = Boolean(progress?.attempted);
        const isBookmarked = Boolean(progress?.bookmarked);
        const isRevision = Boolean(progress?.inRevisionList);

        return (
          <div
            key={`${q.company}-${q.list}-${q.problemId}`}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <a
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-zinc-500">{startIndex + idx}.</span>{" "}
                  {q.title}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getDifficultyColor(q.difficulty)}`}
                >
                  {q.difficulty}
                </span>
                <button
                  type="button"
                  onClick={() => requireProgressOrRun(() => onToggleBookmarked(q))}
                  title={isBookmarked ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={isBookmarked}
                >
                  <Star
                    className={`size-4 ${isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-zinc-500 hover:text-yellow-300"}`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1">
              {q.topicTag.split(",").map((topic) => {
                const trimmed = topic.trim();
                return (
                  <span
                    key={trimmed}
                    className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400"
                  >
                    {trimmed}
                  </span>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-800 pt-2">
              <button
                type="button"
                onClick={() => requireProgressOrRun(() => onToggleSolved(q))}
                title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                aria-pressed={isSolved}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                  isSolved
                    ? "bg-green-500/20 text-green-300"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {isSolved ? "Solved" : "Solve"}
              </button>
              <button
                type="button"
                onClick={() => requireProgressOrRun(() => onToggleAttempted(q))}
                title={isAttempted ? "Remove attempt" : "Mark attempted"}
                aria-pressed={isAttempted}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                  isAttempted
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {isAttempted ? "Attempted" : "Attempt"}
              </button>
              <button
                type="button"
                onClick={() => requireProgressOrRun(() => onToggleRevision(q))}
                title={isRevision ? "Remove from revision" : "Add to revision"}
                aria-pressed={isRevision}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                  isRevision
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                <RotateCcw className="size-3" />
                {isRevision ? "Revising" : "Revision"}
              </button>
              <NotesDialog
                problem={q}
                notes={progress?.notes ?? ""}
                disabled={!progressEnabled}
                onRequireAuth={onRequireAuth}
                onSave={onSaveNotes}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProblemCardList;
