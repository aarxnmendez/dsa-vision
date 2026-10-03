import type { AlgorithmCategory, AlgorithmMeta } from "../types/algorithm";

export interface AlgorithmSearchText {
  title: string;
  description: string;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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
  query: string,
  searchText?: AlgorithmSearchText,
): boolean {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length === 0) {
    return true;
  }

  const haystack = normalizeText(
    [
      searchText?.title ?? algorithm.title,
      searchText?.description ?? algorithm.description,
      ...algorithm.tags,
    ].join(" "),
  );

  return haystack.includes(normalizedQuery);
}
