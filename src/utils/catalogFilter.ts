import type { AlgorithmCategory, AlgorithmMeta } from "../types/algorithm";

export interface AlgorithmSearchText {
  title: string;
  description: string;
}

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
  searchText?: AlgorithmSearchText,
): boolean {
  if (normalizedQuery.length === 0) {
    return true;
  }

  const haystack = [
    searchText?.title ?? algorithm.title,
    searchText?.description ?? algorithm.description,
    ...algorithm.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}
