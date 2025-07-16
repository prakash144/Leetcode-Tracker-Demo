export async function fetchLastUpdated(
    company: string,
    list: string
): Promise<string | null> {
    const encodedPath = `${company}/${encodeURIComponent(list)}`;
    const GITHUB_API_URL = `https://api.github.com/repos/prakash144/leetcode-company-wise-problems/commits?path=${encodedPath}&page=1&per_page=1`;

    try {
        const response = await fetch(GITHUB_API_URL);

        // 👇 Check for HTTP error before parsing JSON
        if (!response.ok) {
            console.error(`GitHub API Error: ${response.status} ${response.statusText}`);
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();

        const formatDate = (date: Date): string => {
            return date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        };

        if (Array.isArray(data) && data.length > 0) {
            const rawDate = data[0]?.commit?.committer?.date;
            if (rawDate) {
                return formatDate(new Date(rawDate));
            }
        }

        // ⏳ Fallback: return date from 6 months ago
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return formatDate(sixMonthsAgo);

    } catch (error) {
        console.error("Error fetching last updated date:", error);
        return "Error";
    }
}
