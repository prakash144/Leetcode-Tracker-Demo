"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CompanyLogo from "@/components/data-display/CompanyLogo";

interface CompanySearchProps {
    onCompanySelect: (company: string) => void;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    userTyping: boolean;
    setUserTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompanySearch = ({
                           onCompanySelect,
                           query,
                           setQuery,
                           userTyping,
                           setUserTyping,
                       }: CompanySearchProps) => {
    const [companies, setCompanies] = useState<string[]>([]);
    const [filtered, setFiltered] = useState<string[]>([]);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    useEffect(() => {
        const fetch = async () => {
            const { fetchCompanyList } = await import("../services/fetchCompanies");
            const list = await fetchCompanyList();
            setCompanies(list);
        };
        fetch();
    }, []);

    useEffect(() => {
        const lower = query.toLowerCase().trim();
        if (lower.length > 0) {
            const results = companies
                .filter((c) => c.toLowerCase().includes(lower))
                .slice(0, 8);
            setFiltered(results);
            setHighlightIndex(-1);
        } else {
            setFiltered([]);
        }
    }, [query, companies]);

    const handleSelect = (company: string) => {
        setQuery(company);
        setFiltered([]);
        setHighlightIndex(-1);
        onCompanySelect(company);
        setUserTyping(false); // Close the dropdown after selection
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (filtered.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightIndex((prev) => (prev + 1) % filtered.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightIndex((prev) =>
                    prev <= 0 ? filtered.length - 1 : prev - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (highlightIndex >= 0) {
                    handleSelect(filtered[highlightIndex]);
                }
                break;
        }
    };

    return (
        <div className="relative w-full">
            <Input
                placeholder="Search company"
                aria-label="Search companies"
                className="text-sm bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setUserTyping(true); // Keep dropdown open while typing
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="company-listbox"
                aria-activedescendant={
                    highlightIndex >= 0 ? `company-option-${highlightIndex}` : undefined
                }
            />
            {filtered.length > 0 && userTyping && ( // Only show dropdown if user is typing
                <ul
                    id="company-listbox"
                    role="listbox"
                    className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-md bg-secondary border border-border text-foreground text-sm shadow-lg"
                >
                    {filtered.map((company, idx) => (
                        <li
                            key={company}
                            id={`company-option-${idx}`}
                            role="option"
                            aria-selected={highlightIndex === idx}
                            onClick={() => handleSelect(company)}
                         className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent ${
                                 idx === highlightIndex ? "bg-accent" : ""
                             }`}
                         >
                             <CompanyLogo company={company} size="sm" />
                             {company}
                         </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompanySearch;
