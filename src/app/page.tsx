"use client";

import { useState, useMemo, useEffect } from "react";
import FilterBar from "./components/FilterBar";
import QuestionTable from "./components/QuestionTable";
import useFetchQuestions from "./services/fetchQuestions";
import Footer from "@/app/components/Footer";
import { fetchLastUpdated } from "./services/fetchLastUpdated";

const Page = () => {
    const [selectedCompany, setSelectedCompany] = useState("Google");
    const [selectedList, setSelectedList] = useState("5. All.csv");
    const [difficulty, setDifficulty] = useState<string>("");
    const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);

    const csvUrl = `https://raw.githubusercontent.com/prakash144/leetcode-company-wise-problems/main/${selectedCompany}/${selectedList}`;
    const { questions, loading, error } = useFetchQuestions(csvUrl);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Debounce logic for search query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500); // debounce delay of 500ms
        return () => clearTimeout(timeoutId); // cleanup timeout
    }, [searchQuery]);

    // Fetch lastUpdated only ONCE (on first mount)
    useEffect(() => {
        const getLastUpdatedOnce = async () => {
            const date = await fetchLastUpdated("Google", "5. All.csv"); // <- hardcoded default path
            setLastUpdated(date);
        };
        getLastUpdatedOnce();
    }, []); // <- empty dependency array ensures it runs only once

    // Filter questions based on the search query
    const formattedQuestions = useMemo(() => {
        return questions
            .map((question, index) => ({
                ...question,
                id: index + 1,
                acceptance: "N/A",
            }))
            .filter((question) =>
                question.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
    }, [questions, debouncedSearchQuery]);

    const handleTopicSelect = (topics: string[]) => {
        setSelectedTopic(topics);
    };

    const handleSearchChange = (searchQuery: string) => {
        setSearchQuery(searchQuery);
    };

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Delay FilterBar rendering until lastUpdated is ready to avoid hydration mismatch */}
            {lastUpdated && (
            <FilterBar
                selectedCompany={selectedCompany}
                onCompanySelect={setSelectedCompany}
                onListSelect={setSelectedList}
                selectedList={selectedList}
                selectedDifficulty={difficulty}
                onDifficultySelect={setDifficulty}
                selectedTopic={selectedTopic}
                onTopicSelect={handleTopicSelect}
                searchTerm={searchQuery}
                onSearchChange={handleSearchChange}
                lastUpdated={lastUpdated}
            />
            )}

            <div className="p-4">
                {loading && <div className="text-center text-gray-500">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                <QuestionTable
                    questions={formattedQuestions}
                    difficultyFilter={difficulty}
                    selectedTopics={selectedTopic}
                    searchTerm={debouncedSearchQuery}
                />
            </div>

            <Footer />
        </main>
    );
};

export default Page;
