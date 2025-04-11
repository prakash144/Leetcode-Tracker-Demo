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
    difficultyFilter: string;  // This will come from FilterBar.tsx
    selectedTopics: string[]; // This will come from the TopicSelector
}

const QuestionTable = ({ questions, difficultyFilter, selectedTopics }: QuestionTableProps) => {
    const [checked, setChecked] = useState<number[]>([]);
    const [bookmarked, setBookmarked] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState<"acceptanceRate" | "frequency" | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // 🧠 Step 1: Filter by difficulty and selected topics
    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            const matchesDifficulty = difficultyFilter ? q.difficulty.toLowerCase() === difficultyFilter.toLowerCase() : true;
            const matchesTopics = (Array.isArray(selectedTopics) && selectedTopics.length === 0) ||
                selectedTopics.some(topic => q.topicTag.split(",").map(tag => tag.trim()).includes(topic));
            return matchesDifficulty && matchesTopics;
        });
    }, [questions, difficultyFilter, selectedTopics]);

    // ✅ Step 2: Compute stats based on filtered questions
    const filteredChecked = filteredQuestions.filter((q) => checked.includes(q.id));
    const filteredBookmarked = filteredQuestions.filter((q) => bookmarked.includes(q.id));

    // 🧠 Step 3: Sorting
    const sortedQuestions = () => {
        const sorted = [...filteredQuestions];

        if (sortBy) {
            sorted.sort((a, b) => {
                let comparison = 0;

                if (sortBy === "acceptanceRate") {
                    const aRate = typeof a.acceptanceRate === "number" ? a.acceptanceRate : parseFloat(a.acceptanceRate);
                    const bRate = typeof b.acceptanceRate === "number" ? b.acceptanceRate : parseFloat(b.acceptanceRate);
                    comparison = aRate - bRate;
                } else if (sortBy === "frequency") {
                    comparison = a.frequency.localeCompare(b.frequency);
                }

                return sortDirection === "asc" ? comparison : -comparison;
            });
        }

        return sorted;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy": return "text-green-400";
            case "medium": return "text-yellow-400";
            case "hard": return "text-red-400";
            default: return "text-white";
        }
    };

    const toggleBookmark = (id: number) => {
        setBookmarked((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

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
                {sortedQuestions().map((q, index) => (
                    <tr
                        key={q.id}
                        className="bg-zinc-800 border-b border-zinc-700 hover:bg-zinc-700/40"
                    >
                        <td className="px-4 py-3 text-zinc-400">{index + 1}</td>

                        <td className="px-4 py-3 font-medium">
                            <a
                                href={q.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-blue-500 transition-colors"
                            >
                                {q.title}
                            </a>
                        </td>

                        <td className="px-4 py-3">
                            {typeof q.acceptanceRate === "number"
                                ? q.acceptanceRate.toFixed(2)
                                : q.acceptanceRate}
                        </td>

                        <td className={`px-4 py-3 font-semibold ${getDifficultyColor(q.difficulty)}`}>
                            {q.difficulty}
                        </td>
                        {/* frequency placeholder */}
                        <td className="px-4 py-3">{q.frequency}</td>
                        {/* Topic placeholder */}
                        <td className="px-4 py-3">
                            {q.topicTag.split(",").map((topic, index) => {
                                const isSelected = selectedTopics.includes(topic.trim());
                                return (
                                    <span
                                        key={index}
                                        className={`inline-block px-2 py-1 mr-2 mb-2 text-sm text-white rounded-md ${isSelected ? 'bg-blue-500' : 'bg-zinc-700'}`}
                                    >
                {topic.trim()}
            </span>
                                );
                            })}
                        </td>

                        <td className="px-4 py-3 text-center">
                            <input
                                type="checkbox"
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
                            <button onClick={() => toggleBookmark(q.id)}>
                                <Star
                                    className={`text-yellow-400 ${bookmarked.includes(q.id) ? "fill-yellow-400" : ""}`}/>
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
