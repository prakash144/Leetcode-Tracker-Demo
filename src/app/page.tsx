"use client";

import { useState } from "react";
import FilterBar from "./components/FilterBar";
import QuestionTable from "./components/QuestionTable";
import useFetchQuestions from "./services/fetchQuestions";

const Page = () => {
    const [selectedCompany, setSelectedCompany] = useState("Google");
    const [selectedList, setSelectedList] = useState("1. Thirty Days.csv");
    const [difficulty, setDifficulty] = useState<string>("");
    const [selectedTopic, setSelectedTopic] = useState<string[]>([]);

    const csvUrl = `https://raw.githubusercontent.com/prakash144/leetcode-company-wise-problems/main/${selectedCompany}/${selectedList}`;
    const { questions, loading, error } = useFetchQuestions(csvUrl);

    const formattedQuestions = questions.map((question, index) => ({
        ...question,
        id: index + 1,
        acceptance: "N/A",
    }));

    const handleTopicSelect = (topics: string[]) => {
        setSelectedTopic(topics);
    };

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Pass selectedCompany, setSelectedCompany, selectedList, and setDifficulty to FilterBar */}
            <FilterBar
                selectedCompany={selectedCompany}
                onCompanySelect={setSelectedCompany}
                onListSelect={setSelectedList}
                selectedList={selectedList}
                selectedDifficulty={difficulty}
                onDifficultySelect={setDifficulty}
                selectedTopic={selectedTopic}
                onTopicSelect={handleTopicSelect}
            />

            <div className="p-4">
                {loading && <div className="text-center text-gray-500">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                <QuestionTable questions={formattedQuestions} difficultyFilter={difficulty} selectedTopics={selectedTopic} />
            </div>
        </main>
    );
};

export default Page;
