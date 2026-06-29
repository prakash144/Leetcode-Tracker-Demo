import { useState, useMemo } from "react";
import { RotateCcw, Star } from "lucide-react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";
import NotesDialog from "./NotesDialog";

interface QuestionTableProps {
    questions: Problem[];
    difficultyFilter: string;
    selectedTopics: string[];
    searchTerm: string;
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
    const [sortBy, setSortBy] = useState<"acceptanceRate" | "frequency" | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Memoized filtered questions based on applied filters
    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            const matchesDifficulty = difficultyFilter
                ? q.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
                : true;

            const matchesTopics = selectedTopics.length === 0 || selectedTopics.some(topic =>
                q.topicTag.split(",").map(tag => tag.trim().toLowerCase()).includes(topic.toLowerCase())
            );

            const matchesSearch = searchTerm.trim() === "" || q.title.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesDifficulty && matchesTopics && matchesSearch;
        });
    }, [questions, difficultyFilter, selectedTopics, searchTerm]);

    // Memoized filtered checked and bookmarked questions
    const filteredSolved = useMemo(
        () => filteredQuestions.filter((q) => progressMap[q.problemId]?.solved),
        [filteredQuestions, progressMap]
    );
    const filteredAttempted = useMemo(
        () => filteredQuestions.filter((q) => progressMap[q.problemId]?.attempted),
        [filteredQuestions, progressMap]
    );
    const filteredBookmarked = useMemo(
        () => filteredQuestions.filter((q) => progressMap[q.problemId]?.bookmarked),
        [filteredQuestions, progressMap]
    );

    // Sorting logic for filtered questions
    const sortedQuestions = useMemo(() => {
        const sorted = [...filteredQuestions];
        if (sortBy) {
            sorted.sort((a, b) => {
                let comparison = 0;
                if (sortBy === "acceptanceRate") {
                    const aRate = typeof a.acceptanceRate === "number" ? a.acceptanceRate : parseFloat(a.acceptanceRate as string);
                    const bRate = typeof b.acceptanceRate === "number" ? b.acceptanceRate : parseFloat(b.acceptanceRate as string);
                    comparison = aRate - bRate;
                } else if (sortBy === "frequency") {
                    comparison = a.frequency.localeCompare(b.frequency);
                }
                return sortDirection === "asc" ? comparison : -comparison;
            });
        }
        return sorted;
    }, [filteredQuestions, sortBy, sortDirection]);

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

    // Handle sort action
    const handleSort = (column: "acceptanceRate" | "frequency") => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    return (
        <div className="space-y-4">
            {/* ✅ Count Summary Section */}
            <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Total: {filteredQuestions.length}
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
                {progressLoading && (
                    <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                        Syncing...
                    </div>
                )}
            </div>

            {/* 🔽 Question Table */}
            <table className="w-full text-sm text-left text-zinc-300">
                <thead className="text-xs uppercase bg-zinc-900 text-zinc-500 border-b border-zinc-700">
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
                    <th className="px-4 py-3 text-center">★</th>
                    <th className="px-4 py-3 text-center">Revision</th>
                    <th className="px-4 py-3 text-center">Notes</th>
                </tr>
                </thead>
                <tbody>
                {sortedQuestions.map((q, index) => {
                    const progress = progressMap[q.problemId];

                    return (
                    <tr key={`${q.company}-${q.list}-${q.problemId}`} className="bg-zinc-800 border-b border-zinc-700 hover:bg-zinc-700/40">
                        <td className="px-4 py-3 text-zinc-400">{index + 1}</td>
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
                                onClick={() => requireProgressOrRun(() => onToggleBookmarked(q))}
                                title="Toggle bookmark"
                            >
                                <Star className={`text-yellow-400 ${progress?.bookmarked ? "fill-yellow-400" : ""}`} />
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
    );
};

export default QuestionTable;
