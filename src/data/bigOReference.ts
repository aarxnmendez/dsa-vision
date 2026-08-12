export type ComplexityDimension = "time" | "space";

export interface ComplexityReferenceRow {
  notation: string;
  name: string;
  description: string;
  examples: string;
  color: string;
}

export const timeComplexityIntro =
  "Time complexity measures how the number of operations grows as input size increases. It answers: how much longer will this algorithm take when the dataset doubles?";

export const spaceComplexityIntro =
  "Space complexity measures how much extra memory an algorithm needs beyond the input itself. It answers: how much additional RAM is required as the dataset grows?";

export const timeComplexityRows: ComplexityReferenceRow[] = [
  {
    notation: "O(1)",
    name: "Constant",
    description: "Runtime stays flat regardless of input size.",
    examples: "Hash table lookup, array index access",
    color: "text-secondary",
  },
  {
    notation: "O(log n)",
    name: "Logarithmic",
    description: "Each step eliminates a large fraction of the remaining work.",
    examples: "Binary search on a sorted array",
    color: "text-primary",
  },
  {
    notation: "O(n)",
    name: "Linear",
    description: "Runtime grows in direct proportion to input size.",
    examples: "Linear search through an unsorted array",
    color: "text-tertiary",
  },
  {
    notation: "O(n log n)",
    name: "Linearithmic",
    description: "Slightly worse than linear, but still scalable for large data.",
    examples: "Merge sort, heap sort",
    color: "text-on-tertiary-fixed-variant",
  },
  {
    notation: "O(n²)",
    name: "Quadratic",
    description: "Doubling input size can quadruple the runtime.",
    examples: "Bubble sort, selection sort, nested loops",
    color: "text-error",
  },
];

export const spaceComplexityRows: ComplexityReferenceRow[] = [
  {
    notation: "O(1)",
    name: "Constant",
    description: "Uses a fixed amount of extra memory regardless of input size.",
    examples: "Iterative binary search, in-place bubble sort",
    color: "text-secondary",
  },
  {
    notation: "O(log n)",
    name: "Logarithmic",
    description: "Extra memory grows with recursion depth, not input size directly.",
    examples: "Recursive call stack (e.g. recursive binary search)",
    color: "text-primary",
  },
  {
    notation: "O(n)",
    name: "Linear",
    description: "Requires auxiliary structures that scale with input size.",
    examples: "Auxiliary arrays, hash maps, merge sort buffer",
    color: "text-tertiary",
  },
];

export const auxiliaryMemoryPoints = [
  {
    title: "Call stack (recursion)",
    detail:
      "Each recursive call adds a frame to the stack. Depth is often O(log n) for divide-and-conquer algorithms like recursive binary search.",
  },
  {
    title: "Auxiliary data structures",
    detail:
      "Temporary arrays, hash maps, queues, or output buffers allocated during execution. Merge sort needs O(n) extra space for merging.",
  },
  {
    title: "In-place algorithms",
    detail:
      "Algorithms that rearrange data within the original input use O(1) extra space beyond a few pointer variables — iterative binary search and bubble sort are common examples.",
  },
];
