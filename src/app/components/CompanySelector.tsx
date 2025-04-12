"use client";

import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CompanySearch from "./CompanySearch";

// Define types for company categories
type CompanyCategory = {
    [category: string]: string[];
};

const companies: CompanyCategory = {
    "Tech Giants": ["Google", "Microsoft", "Apple", "Amazon", "Meta", "Tesla", "IBM", "Intel", "Oracle", "Samsung"],
    Startups: ["Stripe", "Airbnb", "OpenAI", "Notion", "Figma", "Duolingo", "Canva", "Plaid", "Gusto", "Razorpay"],
    Consulting: ["McKinsey", "BCG", "Bain", "Deloitte", "PwC", "EY", "KPMG", "Accenture", "ZS Associates", "Capgemini"],
    Other: ["Spotify", "Slack", "Reddit", "Zoom", "Pinterest", "Atlassian", "Salesforce", "Cisco", "Twilio", "Shopify"],
};

interface CompanySelectorProps {
    selectedCompanies: string;
    onCompanyChange: (company: string) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
                                                             selectedCompanies,
                                                             onCompanyChange,
                                                         }) => {
    const allCompanies = Object.values(companies).flat();
    const defaultCompany = selectedCompanies || allCompanies[0];

    const [selectedCompany, setSelectedCompany] = useState<string>(defaultCompany);
    const [query, setQuery] = useState<string>("");
    const [userTyping, setUserTyping] = useState(false);

    useEffect(() => {
        setSelectedCompany(defaultCompany);
        onCompanyChange(defaultCompany);
    }, [defaultCompany, onCompanyChange]);

    const handleCompanySelect = (company: string) => {
        setSelectedCompany(company);
        onCompanyChange(company);
        setQuery(company);
        setUserTyping(false); // Prevent dropdown from staying open
    };

    const clearSelection = () => {
        const fallback = "Google";
        setSelectedCompany(fallback);
        onCompanyChange(fallback);
        setQuery(""); // Reset search box
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    className="text-sm text-zinc-300 hover:text-zinc-100 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors duration-150 rounded-md"
                >
                    {selectedCompany || "Select Company"} <ChevronDown size={16} />
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full bg-zinc-900 border border-zinc-700 text-white p-6 rounded-lg -translate-x-1/2 -translate-y-1/2 z-50">
                    <Dialog.Title className="text-xl font-semibold mb-2">Select a Company</Dialog.Title>

                    {/* Search Box */}
                    <CompanySearch
                        onCompanySelect={handleCompanySelect}
                        query={query}
                        setQuery={setQuery}
                        userTyping={userTyping}
                        setUserTyping={setUserTyping}
                    />

                    {/* Company Categories */}
                    <ScrollArea className="h-64 pr-2 mt-4 space-y-4">
                        {Object.entries(companies).map(([category, companyList]) => (
                            <div key={category}>
                                <h3 className="text-sm text-zinc-400 font-medium mb-1">{category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {companyList.map((company) => (
                                        <span
                                            key={company}
                                            onClick={() => handleCompanySelect(company)}
                                            className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition-colors duration-200 ${
                                                selectedCompany === company
                                                    ? "bg-green-600 text-white border-green-500"
                                                    : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                                            }`}
                                        >
                                            {company}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-2 mt-6">
                        <Button
                            onClick={clearSelection}
                            variant="outline"
                            className="flex-1 text-sm text-zinc-300 hover:text-zinc-100 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                        >
                            Clear
                        </Button>
                        <Dialog.Close asChild>
                            <Button
                                variant="outline"
                                className="flex-1 text-sm text-zinc-300 hover:text-zinc-100 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                            >
                                Close
                            </Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default CompanySelector;
