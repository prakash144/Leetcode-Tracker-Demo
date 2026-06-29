"use client";

import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import QuestionTable from "./components/QuestionTable";
import useFetchQuestions from "./services/fetchQuestions";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { fetchLastUpdated } from "./services/fetchLastUpdated";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProblemProgress } from "@/hooks/useProblemProgress";
import DashboardStats from "./components/DashboardStats";
import Heatmap from "./components/Heatmap";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { filterProblems } from "@/features/problems/hooks/useFilteredProblems";
import { useProblemFilters } from "@/features/problems/hooks/useProblemFilters";

const Page = () => {
    const [selectedCompany, setSelectedCompany] = useState("Google");
    const [selectedList, setSelectedList] = useState("5. All.csv");
    const {
        difficulty,
        hasActiveFilters,
        resetFilters,
        searchTerm,
        selectedTopics,
        setDifficulty,
        setSearchTerm,
        setSelectedTopics,
        setStatusFilter,
        statusFilter,
    } = useProblemFilters();
    const searchQuery = searchTerm;
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

    return (
        <AppShell
            user={user}
            authLoading={authLoading}
            isAuthConfigured={isAuthConfigured}
            onLogin={login}
            onLogout={logout}
            footer={<Footer />}
        >
            <PageHeader
                eyebrow="Dashboard"
                title="Problem Tracker"
                description="Track company-wise LeetCode practice, review activity, and keep progress synced to your account."
            />

            {/* Delay FilterBar rendering until lastUpdated is ready to avoid hydration mismatch */}
            {lastUpdated && (
            <FilterBar
                selectedCompany={selectedCompany}
                onCompanySelect={setSelectedCompany}
                onListSelect={setSelectedList}
                selectedList={selectedList}
                selectedDifficulty={difficulty}
                onDifficultySelect={setDifficulty}
                selectedTopic={selectedTopics}
                onTopicSelect={setSelectedTopics}
                selectedStatus={statusFilter}
                onStatusSelect={setStatusFilter}
                searchTerm={searchQuery}
                onSearchChange={setSearchTerm}
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
                lastUpdated={lastUpdated}
            />
            )}

            <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
                {loading && <LoadingState />}
                {error && <ErrorState message={error} />}
                {authError && <ErrorState message={authError} />}
                {progressError && <ErrorState message={progressError} />}
                <DashboardStats questions={formattedQuestions} progressMap={progressMap} />
                <Heatmap uid={user?.uid} />
                <QuestionTable
                    questions={questions}
                    difficultyFilter={difficulty}
                    selectedTopics={selectedTopics}
                    searchTerm={debouncedSearchQuery}
                    statusFilter={statusFilter}
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
        </AppShell>
    );
};

export default Page;
