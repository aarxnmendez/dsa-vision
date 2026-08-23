import type { AlgorithmCategory, AlgorithmMeta } from "../types/algorithm";

export function algorithmMatchesCategory(
  algorithm: AlgorithmMeta,
  category: AlgorithmCategory,
): boolean {
  if (category === "all") {
    return true;
  }

  return (
    algorithm.category === category || algorithm.tags.includes(category)
  );
}

export function algorithmMatchesSearch(
  algorithm: AlgorithmMeta,
  normalizedQuery: string,
): boolean {
  if (normalizedQuery.length === 0) {
    return true;
  }

  const haystack = [
    algorithm.title,
    algorithm.description,
    ...algorithm.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}
