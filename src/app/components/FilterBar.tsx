"use client";

import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TopicSelector from "./TopicSelector";
import CompanySelector from "./CompanySelector";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FilterBarProps {
    selectedCompany: string;
    onCompanySelect: (company: string) => void;
    onListSelect: (list: string) => void;
    selectedList: string;
    selectedDifficulty: string;
    onDifficultySelect: (difficulty: string) => void;
    selectedTopic: string[];
    onTopicSelect: (topics: string[]) => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    lastUpdated?: string | null;
}

const FilterBar = ({
                       selectedCompany,
                       onCompanySelect,
                       onListSelect,
                       selectedList,
                       selectedDifficulty,
                       onDifficultySelect,
                       selectedTopic,
                       onTopicSelect,
                       searchTerm,
                       onSearchChange,
                       lastUpdated,
                   }: FilterBarProps) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const listOptions = [
        { label: "Last 30 Days", value: "1. Thirty Days.csv" },
        { label: "Last 3 Months", value: "2. Three Months.csv" },
        { label: "Last 6 Months", value: "3. Six Months.csv" },
        { label: "More Than 6 Months", value: "4. More Than Six Months.csv" },
        { label: "All Time", value: "5. All.csv" },
    ];

    const difficulties = ["Easy", "Medium", "Hard"];

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-zinc-900 border-b border-zinc-700">
            <div className="flex flex-wrap items-center gap-2">
                {/* List Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="text-sm text-zinc-300 hover:text-zinc-100 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            Lists <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-900 border border-zinc-700 text-white">
                        {listOptions.map(({ label, value }) => (
                            <DropdownMenuItem
                                key={value}
                                className={`hover:bg-zinc-800 cursor-pointer ${
                                    selectedList === value ? "bg-zinc-800 font-semibold text-green-400" : ""
                                }`}
                                onClick={() => onListSelect(value)}
                            >
                                {selectedList === value && <span className="mr-2">✅</span>}
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Difficulty Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="text-sm text-zinc-300 hover:text-zinc-100 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            {selectedDifficulty || "Difficulty"} <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-900 border-zinc-700 text-white">
                        {difficulties.map((item) => (
                            <DropdownMenuItem
                                key={item}
                                className={`hover:bg-zinc-800 cursor-pointer ${
                                    selectedDifficulty === item ? "bg-zinc-800 font-semibold text-green-400" : ""
                                }`}
                                onClick={() =>
                                    onDifficultySelect(selectedDifficulty === item ? '' : item)
                                }
                            >
                                {selectedDifficulty === item && <span className="mr-2">✅</span>}
                                {item}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Topic Selector */}
                <div className="flex items-center gap-4">
                    <TopicSelector selectedTopics={selectedTopic} onTopicChange={onTopicSelect} />
                </div>

                {/* Company Selector */}
                <div className="flex items-center gap-4">
                    <CompanySelector
                        selectedCompanies={selectedCompany}
                        onCompanyChange={onCompanySelect}
                    />
                </div>
            </div>

            {/* Search + Avatar */}
            <div className="flex items-center gap-3">
                {/* Last Updated Info */}
                <div className="text-green-400 font-bold text-xs mr-2 whitespace-nowrap">
                    Update Problems: {lastUpdated ?? "Loading..."}
                </div>

                {/* Search */}
                <Input
                    placeholder="Search questions"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-[240px] text-sm bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="w-8 h-8 cursor-pointer border border-zinc-600">
                            <AvatarFallback className="text-xs bg-zinc-800 text-white">U</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-900 border-zinc-700 text-white w-40">
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                            Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                            Login
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default FilterBar;
