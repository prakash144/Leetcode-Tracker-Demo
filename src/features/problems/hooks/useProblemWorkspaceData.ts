"use client";

import { useEffect, useState } from "react";
import useFetchQuestions from "@/app/services/fetchQuestions";
import { fetchLastUpdated } from "@/app/services/fetchLastUpdated";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProblemProgress } from "@/hooks/useProblemProgress";
import { useProblemFilters } from "./useProblemFilters";

const DEFAULT_COMPANY = "Google";
const DEFAULT_LIST = "5. All.csv";

export const useProblemWorkspaceData = () => {
  const [selectedCompany, setSelectedCompany] = useState(DEFAULT_COMPANY);
  const [selectedList, setSelectedList] = useState(DEFAULT_LIST);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const filters = useProblemFilters();
  const debouncedSearchQuery = useDebouncedValue(filters.searchTerm, 500);
  const auth = useAuth();

  const csvUrl = `https://raw.githubusercontent.com/prakash144/leetcode-company-wise-problems/main/${selectedCompany}/${selectedList}`;
  const questionsState = useFetchQuestions(csvUrl, {
    company: selectedCompany,
    list: selectedList,
  });
  const progress = useProblemProgress(auth.user?.uid);

  useEffect(() => {
    let cancelled = false;

    const loadLastUpdated = async () => {
      setLastUpdated(null);
      const date = await fetchLastUpdated(selectedCompany, selectedList);

      if (!cancelled) {
        setLastUpdated(date);
      }
    };

    loadLastUpdated();

    return () => {
      cancelled = true;
    };
  }, [selectedCompany, selectedList]);

  return {
    auth,
    csvUrl,
    debouncedSearchQuery,
    filters,
    lastUpdated,
    progress,
    questionsState,
    selectedCompany,
    selectedList,
    setSelectedCompany,
    setSelectedList,
  };
};

export type ProblemWorkspaceData = ReturnType<typeof useProblemWorkspaceData>;
