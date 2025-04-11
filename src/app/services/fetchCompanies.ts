interface GithubContentItem {
    name: string;
    path: string;
    type: "file" | "dir";
    // optionally add: sha, url, etc if needed later
}

export async function fetchCompanyList(): Promise<string[]> {
    const GITHUB_API_URL = "https://api.github.com/repos/prakash144/leetcode-company-wise-problems/contents";

    try {
        const response = await fetch(GITHUB_API_URL);
        const data: GithubContentItem[] = await response.json();

        const folders = data
            .filter((item) => item.type === "dir")
            .map((item) => item.name)
            .sort();
        console.log(folders.join(", "));
        return folders;
    } catch (error) {
        console.error("Error fetching companies:", error);
        return [];
    }
}
