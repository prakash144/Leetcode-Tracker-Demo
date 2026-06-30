"use client";

import { useMemo } from "react";
import { Bookmark, LogIn } from "lucide-react";
import QuestionTable from "@/app/components/QuestionTable";
import EmptyState from "@/components/states/EmptyState";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { Button } from "@/components/ui/button";
import type { ProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { filterProblems } from "@/features/problems/hooks/useFilteredProblems";

interface FavoriteProblemsViewProps {
  workspace: ProblemWorkspaceData;
}

const FavoriteProblemsView = ({ workspace }: FavoriteProblemsViewProps) => {
  const {
    auth,
    debouncedSearchQuery,
    filters,
    progress,
    questionsState,
  } = workspace;

  const favoriteProblems = useMemo(
    () =>
      filterProblems(questionsState.questions, {
        difficulty: filters.difficulty,
        selectedTopics: filters.selectedTopics,
        searchTerm: debouncedSearchQuery,
        status: "bookmarked",
        progressMap: progress.progressMap,
      }),
    [
      debouncedSearchQuery,
      filters.difficulty,
      filters.selectedTopics,
      progress.progressMap,
      questionsState.questions,
    ]
  );

  if (!auth.user) {
    return (
      <section className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-zinc-800 text-yellow-300">
            <Bookmark className="size-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">Sign in to view favorites</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Favorites are stored in your personal Firestore progress. Sign in to
            see bookmarked problems from the currently loaded dataset.
          </p>
          <Button
            type="button"
            className="mt-5 bg-yellow-400 text-black hover:bg-yellow-300"
            disabled={!auth.isConfigured || auth.loading}
            onClick={auth.login}
          >
            <LogIn className="size-4" />
            {auth.loading ? "Checking..." : "Sign in"}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-4 p-4 sm:px-6 lg:px-8">
      {questionsState.loading && <LoadingState />}
      {questionsState.error && <ErrorState message={questionsState.error} />}
      {auth.error && <ErrorState message={auth.error} />}
      {progress.error && <ErrorState message={progress.error} />}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="text-sm font-semibold text-white">
          {favoriteProblems.length} bookmarked problem
          {favoriteProblems.length === 1 ? "" : "s"} in this dataset
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          This view uses the same bookmark field as the star action in the
          Problems workspace. Unbookmarking a row removes it from this list.
        </p>
      </div>

      {!questionsState.loading && favoriteProblems.length === 0 && (
        <EmptyState message="No favorites in the current dataset. Open Problems and star a problem to add it here." />
      )}

      {favoriteProblems.length > 0 && (
        <QuestionTable
          questions={favoriteProblems}
          difficultyFilter=""
          selectedTopics={[]}
          searchTerm=""
          statusFilter="all"
          progressMap={progress.progressMap}
          progressLoading={progress.loading}
          progressEnabled={Boolean(auth.user)}
          onRequireAuth={auth.login}
          onToggleSolved={progress.toggleSolved}
          onToggleAttempted={progress.toggleAttempted}
          onToggleBookmarked={progress.toggleBookmarked}
          onToggleRevision={progress.toggleRevision}
          onSaveNotes={progress.saveNotes}
        />
      )}
    </section>
  );
};

export default FavoriteProblemsView;
