"use client";

import { useEffect, useState } from "react";
import { fetchCompanyList } from "../services/fetchCompanies";
import { Input } from "@/components/ui/input";

interface CompanySearchProps {
    onCompanySelect: (company: string) => void;
}

const CompanySearch = ({ onCompanySelect }: CompanySearchProps) => {
    const [companies, setCompanies] = useState<string[]>([]);
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<string[]>([]);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    // Fetch the list of companies from GitHub repo
    useEffect(() => {
        const fetch = async () => {
            const list = await fetchCompanyList();
            setCompanies(list);
        };
        fetch();
    }, []);

    // Filter company suggestions on query change
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
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (filtered.length === 0) return;

        if (e.key === "ArrowDown") {
            setHighlightIndex((prev) => (prev + 1) % filtered.length);
        } else if (e.key === "ArrowUp") {
            setHighlightIndex((prev) =>
                prev <= 0 ? filtered.length - 1 : prev - 1
            );
        } else if (e.key === "Enter" && highlightIndex >= 0) {
            handleSelect(filtered[highlightIndex]);
        }
    };

    return (
        <div className="relative w-[260px]">
            <Input
                placeholder="Search company"
                className="text-sm bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            {filtered.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm shadow-lg">
                    {filtered.map((company, idx) => (
                        <li
                            key={company}
                            onClick={() => handleSelect(company)}
                            className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${
                                idx === highlightIndex ? "bg-zinc-700" : ""
                            }`}
                        >
                            {company}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompanySearch;