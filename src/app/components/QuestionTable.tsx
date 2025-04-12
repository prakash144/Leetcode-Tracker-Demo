import { useState, useMemo } from "react";
import { Star } from "lucide-react";

interface Question {
    id: number;
    title: string;
    link: string;
    difficulty: string;
    frequency: string;
    acceptanceRate: string | number;
    topicTag: string;
}

interface QuestionTableProps {
    questions: Question[];
    difficultyFilter: string;
    selectedTopics: string[];
    searchTerm: string;
}

const QuestionTable = ({ questions, difficultyFilter, selectedTopics, searchTerm }: QuestionTableProps) => {
    const [checked, setChecked] = useState<number[]>([]);
    const [bookmarked, setBookmarked] = useState<number[]>([]);
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
    const filteredChecked = useMemo(() => filteredQuestions.filter((q) => checked.includes(q.id)), [filteredQuestions, checked]);
    const filteredBookmarked = useMemo(() => filteredQuestions.filter((q) => bookmarked.includes(q.id)), [filteredQuestions, bookmarked]);

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

    // Toggle bookmark state
    const toggleBookmark = (id: number) => {
        setBookmarked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
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
                    Solved: {filteredChecked.length}
                </div>
                <div className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    Bookmarked: {filteredBookmarked.length}
                </div>
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
                    <th className="px-4 py-3 text-center">★</th>
                </tr>
                </thead>
                <tbody>
                {sortedQuestions.map((q, index) => (
                    <tr key={q.id} className="bg-zinc-800 border-b border-zinc-700 hover:bg-zinc-700/40">
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
                                checked={checked.includes(q.id)}
                                onChange={() =>
                                    setChecked((prev) =>
                                        prev.includes(q.id)
                                            ? prev.filter((x) => x !== q.id)
                                            : [...prev, q.id]
                                    )
                                }
                                className="form-checkbox rounded-full bg-zinc-700 border-zinc-600 text-green-500 cursor-pointer"
                            />
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button onClick={() => toggleBookmark(q.id)} title="Toggle bookmark">
                                <Star className={`text-yellow-400 ${bookmarked.includes(q.id) ? "fill-yellow-400" : ""}`} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuestionTable;
