import { useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";

interface CsvItem {
    Title: string;
    Link: string;
    Difficulty: string;
    Topics: string; // Topic tag from CSV
    Frequency: string;
    "Acceptance Rate": string; // Acceptance Rate as a string
}

interface Question {
    title: string;
    link: string;
    difficulty: string;
    topicTag: string;
    company: string;
    frequency: string;
    acceptanceRate: string | number; // Can be string or number, depending on data format
}

// Utility to fetch and parse the CSV file
const fetchCSV = async (url: string): Promise<CsvItem[]> => {
    const response = await fetch(url);
    const text = await response.text();

    const result: ParseResult<CsvItem> = Papa.parse<CsvItem>(text, {
        header: true,
        skipEmptyLines: true,
    });

    return result.data;
};

// Custom hook to fetch questions and manage loading/error state
const useFetchQuestions = (url: string) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadQuestions = async () => {
            setLoading(true);
            setError(""); // Reset error before fetching

            try {
                const data = await fetchCSV(url);

                // Map data to desired structure
                const formattedData = data.map((item) => ({
                    title: item.Title,
                    link: item.Link,
                    difficulty: item.Difficulty,
                    topicTag: item.Topics,
                    company: "Google", // Example: Assuming the company is fixed for now
                    frequency: item.Frequency,
                    // Convert 'Acceptance Rate' to percentage
                    acceptanceRate: convertToPercentage(item["Acceptance Rate"]),
                }));

                setQuestions(formattedData);
                setLoading(false);
            } catch (err) {
                console.error("Error loading CSV data:", err); // Log the error
                setError("Error loading CSV data");
                setLoading(false);
            }
        };

        loadQuestions();
    }, [url]); // Refetch when the URL changes

    return { questions, loading, error };
};

// Utility function to convert a value to percentage
const convertToPercentage = (rate: string): string => {
    const parsedRate = parseFloat(rate);
    if (!isNaN(parsedRate)) {
        return (parsedRate * 100).toFixed(2) + "%"; // Convert to percentage and keep 2 decimal places
    }
    return rate; // Return the original value if it's not a valid number
};

export default useFetchQuestions;
