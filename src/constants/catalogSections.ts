export type CatalogSectionId = "dataStructures" | "searching" | "sorting";

export interface CatalogSectionDefinition {
  id: CatalogSectionId;
  algorithmIds: readonly string[];
}

export const CATALOG_SECTIONS: readonly CatalogSectionDefinition[] = [
  {
    id: "dataStructures",
    algorithmIds: ["array", "linked-list", "stack"],
  },
  {
    id: "searching",
    algorithmIds: ["sequential-search", "binary-search"],
  },
  {
    id: "sorting",
    algorithmIds: ["selection-sort", "insertion-sort", "quick-sort"],
  },
] as const;
