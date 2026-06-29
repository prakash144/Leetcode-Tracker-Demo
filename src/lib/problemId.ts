const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const hashText = (value: string) => {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
};

export const getProblemId = (link: string, title: string) => {
  try {
    const url = new URL(link);
    const problemIndex = url.pathname
      .split("/")
      .filter(Boolean)
      .findIndex((segment) => segment === "problems");

    const slug = url.pathname.split("/").filter(Boolean)[problemIndex + 1];

    if (slug) {
      return normalizeText(slug);
    }
  } catch {
    const match = link.match(/problems\/([^/?#]+)/i);
    if (match?.[1]) {
      return normalizeText(match[1]);
    }
  }

  const normalizedTitle = normalizeText(title);
  return normalizedTitle || `problem-${hashText(`${title}-${link}`)}`;
};
