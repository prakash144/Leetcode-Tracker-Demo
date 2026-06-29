"use client";

import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import QuestionTable from "./components/QuestionTable";
import useFetchQuestions from "./services/fetchQuestions";
import Footer from "@/app/components/Footer";
import { fetchLastUpdated } from "./services/fetchLastUpdated";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProblemProgress } from "@/hooks/useProblemProgress";
import DashboardStats from "./components/DashboardStats";
import Heatmap from "./components/Heatmap";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { filterProblems } from "@/features/problems/hooks/useFilteredProblems";

const Page = () => {
    const [selectedCompany, setSelectedCompany] = useState("Google");
    const [selectedList, setSelectedList] = useState("5. All.csv");
    const [difficulty, setDifficulty] = useState<string>("");
    const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
    const {
        user,
        loading: authLoading,
        error: authError,
        isConfigured: isAuthConfigured,
        login,
        logout,
    } = useAuth();

    const csvUrl = `https://raw.githubusercontent.com/prakash144/leetcode-company-wise-problems/main/${selectedCompany}/${selectedList}`;
    const { questions, loading, error } = useFetchQuestions(csvUrl, {
        company: selectedCompany,
        list: selectedList,
    });
    const {
        progressMap,
        loading: progressLoading,
        error: progressError,
        toggleSolved,
        toggleAttempted,
        toggleBookmarked,
        toggleRevision,
        saveNotes,
    } = useProblemProgress(user?.uid);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

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
        return filterProblems(questions, { searchTerm: debouncedSearchQuery });
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
                authUser={user}
                authLoading={authLoading}
                isAuthConfigured={isAuthConfigured}
                onLogin={login}
                onLogout={logout}
            />
            )}

            <div className="p-4">
                {loading && <LoadingState />}
                {error && <ErrorState message={error} />}
                {authError && <ErrorState message={authError} />}
                {progressError && <ErrorState message={progressError} />}
                <DashboardStats questions={formattedQuestions} progressMap={progressMap} />
                <Heatmap uid={user?.uid} />
                <QuestionTable
                    questions={formattedQuestions}
                    difficultyFilter={difficulty}
                    selectedTopics={selectedTopic}
                    searchTerm={debouncedSearchQuery}
                    progressMap={progressMap}
                    progressLoading={progressLoading}
                    progressEnabled={Boolean(user)}
                    onRequireAuth={login}
                    onToggleSolved={toggleSolved}
                    onToggleAttempted={toggleAttempted}
                    onToggleBookmarked={toggleBookmarked}
                    onToggleRevision={toggleRevision}
                    onSaveNotes={saveNotes}
                />
            </div>

            <Footer />
        </main>
    );
};

export default Page;
