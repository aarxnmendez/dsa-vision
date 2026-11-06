export interface StructureComplexityRow {
  access: string;
  search: string;
  insert: string;
  remove: string;
  space: string;
}

export interface AlgorithmComplexityRow {
  best: string;
  average: string;
  worst: string;
  space: string;
  /** null when stability does not apply (searching). */
  stable: boolean | null;
}

/** Keyed by catalog id; rows mirror the complexity tables on each visualizer page. */
export const STRUCTURE_COMPLEXITY: Record<string, StructureComplexityRow> = {
  array: {
    access: "O(1)",
    search: "O(n)",
    insert: "O(n)",
    remove: "O(n)",
    space: "O(n)",
  },
  "linked-list": {
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)",
    remove: "O(1)",
    space: "O(n)",
  },
  stack: {
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)",
    remove: "O(1)",
    space: "O(n)",
  },
  queue: {
    access: "O(n)",
    search: "O(n)",
    insert: "O(1)",
    remove: "O(1)",
    space: "O(n)",
  },
};

export const ALGORITHM_COMPLEXITY: Record<string, AlgorithmComplexityRow> = {
  "sequential-search": {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    stable: null,
  },
  "binary-search": {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    stable: null,
  },
  "selection-sort": {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
  },
  "insertion-sort": {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
  },
  "merge-sort": {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
  },
  "quick-sort": {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
  },
};

type ComplexityTone = "complexity-success" | "complexity-tertiary" | "complexity-error";

export function complexityTone(value: string): ComplexityTone {
  if (value === "O(1)" || value === "O(log n)") {
    return "complexity-success";
  }
  if (value === "O(n)" || value === "O(n log n)") {
    return "complexity-tertiary";
  }
  return "complexity-error";
}
