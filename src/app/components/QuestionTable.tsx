import { RotateCcw, Star } from "lucide-react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";
import EmptyState from "@/components/states/EmptyState";
import {
    type ProblemStatusFilter,
    useFilteredProblems,
} from "@/features/problems/hooks/useFilteredProblems";
import { useProblemSorting } from "@/features/problems/hooks/useProblemSorting";
import { usePagination } from "@/features/problems/hooks/usePagination";
import ProblemPagination from "@/features/problems/components/ProblemPagination";
import ProblemCardList from "@/features/problems/components/ProblemCardList";
import NotesDialog from "./NotesDialog";

interface QuestionTableProps {
    questions: Problem[];
    difficultyFilter: string;
    selectedTopics: string[];
    searchTerm: string;
    statusFilter: ProblemStatusFilter;
    progressMap: ProgressMap;
    progressLoading: boolean;
    progressEnabled: boolean;
    onRequireAuth: () => void;
    onToggleSolved: (problem: Problem) => void;
    onToggleAttempted: (problem: Problem) => void;
    onToggleBookmarked: (problem: Problem) => void;
    onToggleRevision: (problem: Problem) => void;
    onSaveNotes: (problem: Problem, notes: string) => void;
}

const QuestionTable = ({
                           questions,
                           difficultyFilter,
                           selectedTopics,
                           searchTerm,
                           statusFilter,
                           progressMap,
                           progressLoading,
                           progressEnabled,
                           onRequireAuth,
                           onToggleSolved,
                           onToggleAttempted,
                           onToggleBookmarked,
                           onToggleRevision,
                           onSaveNotes,
                       }: QuestionTableProps) => {
    const filteredQuestions = useFilteredProblems(questions, {
        difficulty: difficultyFilter,
        selectedTopics,
        searchTerm,
        status: statusFilter,
        progressMap,
    });
    const { sortedProblems, sortBy, sortDirection, handleSort } =
        useProblemSorting(filteredQuestions);
    const {
        currentPage,
        pageSize,
        range,
        setCurrentPage,
        setPageSize,
        totalPages,
    } = usePagination(sortedProblems.length);
    const paginatedProblems = sortedProblems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const filteredSolved = filteredQuestions.filter((q) => progressMap[q.problemId]?.solved);
    const filteredAttempted = filteredQuestions.filter((q) => progressMap[q.problemId]?.attempted);
    const filteredBookmarked = filteredQuestions.filter((q) => progressMap[q.problemId]?.bookmarked);
    const filteredRevision = filteredQuestions.filter((q) => progressMap[q.problemId]?.inRevisionList);

    // Utility function to get color based on difficulty
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy": return "text-green-400";
            case "medium": return "text-yellow-400";
            case "hard": return "text-red-400";
            default: return "text-white";
        }
    };

    const requireProgressOrRun = (action: () => void) => {
        if (!progressEnabled) {
            onRequireAuth();
            return;
        }

        action();
    };

    return (
        <div className="space-y-4">
            {/* ✅ Count Summary Section */}
            <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Dataset: {questions.length}
                </div>
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Filtered: {filteredQuestions.length}
                </div>
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Page: {range.from}-{range.to}
                </div>
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Solved: {filteredSolved.length}
                </div>
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Attempted: {filteredAttempted.length}
                </div>
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Bookmarked: {filteredBookmarked.length}
                </div>
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Revision: {filteredRevision.length}
                </div>
                {progressLoading && (
                    <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                        Syncing...
                    </div>
                )}
            </div>

            {sortedProblems.length === 0 && (
                <EmptyState message="No questions match the current filters." />
            )}

            {/* 🔽 Mobile Problem Cards */}
            <div className="block lg:hidden">
                {sortedProblems.length > 0 && (
                    <ProblemCardList
                        problems={paginatedProblems}
                        startIndex={range.from}
                        progressMap={progressMap}
                        progressEnabled={progressEnabled}
                        onRequireAuth={onRequireAuth}
                        onToggleSolved={onToggleSolved}
                        onToggleAttempted={onToggleAttempted}
                        onToggleBookmarked={onToggleBookmarked}
                        onToggleRevision={onToggleRevision}
                        onSaveNotes={onSaveNotes}
                    />
                )}
            </div>

            {/* 🔽 Desktop Question Table */}
            <div className="hidden lg:block">
            {sortedProblems.length > 0 && (
            <>
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-300">
                <thead className="sticky top-0 z-10 text-xs uppercase bg-zinc-900 text-zinc-500 border-b border-zinc-700">
                <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Title</th>
                    <th
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => handleSort("acceptanceRate")}
                    >
                        Acceptance
                        {sortBy === "acceptanceRate" && (
                            <span className={sortDirection === "asc" ? "text-green-400" : "text-red-400"}>
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                        )}
                    </th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => handleSort("frequency")}
                    >
                        Frequency
                        {sortBy === "frequency" && (
                            <span className={sortDirection === "asc" ? "text-green-400" : "text-red-400"}>
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                        )}
                    </th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Attempted</th>
                    <th className="px-4 py-3 text-center"><Star className="size-4 inline-block text-yellow-400" /></th>
                    <th className="px-4 py-3 text-center">Revision</th>
                    <th className="px-4 py-3 text-center">Notes</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProblems.map((q, index) => {
                    const progress = progressMap[q.problemId];

                    return (
                    <tr key={`${q.company}-${q.list}-${q.problemId}`} className="bg-zinc-800 border-b border-zinc-700 hover:bg-zinc-700/40">
                        <td className="px-4 py-3 text-zinc-400">{range.from + index}</td>
                        <td className="px-4 py-3 font-medium">
                            <a href={q.link} target="_blank" rel="noopener noreferrer" title={q.title} className="text-white hover:text-blue-500 transition-colors">
                                {q.title}
                            </a>
                        </td>
                        <td className="px-4 py-3">
                            {typeof q.acceptanceRate === "number" ? q.acceptanceRate.toFixed(2) : q.acceptanceRate}
                        </td>
                        <td className={`px-4 py-3 font-semibold ${getDifficultyColor(q.difficulty)}`}>
                            {q.difficulty}
                        </td>
                        <td className="px-4 py-3">{q.frequency}</td>
                        <td className="px-4 py-3">
                            {q.topicTag.split(",").map((topic, i) => {
                                const trimmedTopic = topic.trim();
                                const isSelected = selectedTopics.includes(trimmedTopic);
                                return (
                                    <span key={i} className={`inline-block px-2 py-1 mr-2 mb-2 text-sm text-white rounded-md ${isSelected ? 'bg-blue-500' : 'bg-zinc-700'}`}>
                                            {trimmedTopic}
                                        </span>
                                );
                            })}
                        </td>
                        <td className="px-4 py-3 text-center">
                            <input
                                type="checkbox"
                                title="Mark as solved"
                                checked={Boolean(progress?.solved)}
                                onChange={() => requireProgressOrRun(() => onToggleSolved(q))}
                                className="form-checkbox rounded-full bg-zinc-700 border-zinc-600 text-green-500 cursor-pointer"
                            />
                        </td>
                        <td className="px-4 py-3 text-center">
                            <input
                                type="checkbox"
                                title="Mark as attempted"
                                checked={Boolean(progress?.attempted)}
                                onChange={() => requireProgressOrRun(() => onToggleAttempted(q))}
                                className="form-checkbox rounded-full bg-zinc-700 border-zinc-600 text-blue-500 cursor-pointer"
                            />
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button
                                type="button"
                                onClick={() => requireProgressOrRun(() => onToggleBookmarked(q))}
                                title={progress?.bookmarked ? "Remove from favorites" : "Add to favorites"}
                                aria-label={progress?.bookmarked ? "Remove from favorites" : "Add to favorites"}
                                aria-pressed={Boolean(progress?.bookmarked)}
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                                    progress?.bookmarked
                                        ? "bg-yellow-400/10 text-yellow-300"
                                        : "text-zinc-400 hover:bg-zinc-700 hover:text-yellow-300"
                                }`}
                            >
                                <Star className={`size-4 ${progress?.bookmarked ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                <span className="sr-only sm:not-sr-only">
                                    {progress?.bookmarked ? "Saved" : "Save"}
                                </span>
                            </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button
                                onClick={() => requireProgressOrRun(() => onToggleRevision(q))}
                                title="Toggle revision"
                                className={progress?.inRevisionList ? "text-cyan-400" : "text-zinc-400"}
                            >
                                <RotateCcw size={18} />
                            </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <NotesDialog
                                problem={q}
                                notes={progress?.notes ?? ""}
                                disabled={!progressEnabled}
                                onRequireAuth={onRequireAuth}
                                onSave={onSaveNotes}
                            />
                        </td>
                    </tr>
                )})}
                </tbody>
            </table>
            </div>
            </>
            )}
            </div>
            <ProblemPagination
                currentPage={currentPage}
                pageSize={pageSize}
                rangeFrom={range.from}
                rangeTo={range.to}
                totalItems={sortedProblems.length}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />
        </div>
    );
};

export default QuestionTable;
