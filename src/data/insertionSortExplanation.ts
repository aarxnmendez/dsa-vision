import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export const insertionSortExplanation: AlgorithmExplanationData = {
  howItWorks:
    "Insertion Sort builds a sorted prefix on the left one element at a time. Each pass picks a key from the unsorted suffix, compares it right-to-left against the sorted partition, shifts larger values one position to the right, and inserts the key into its correct position.",
  keyConcepts: [
    "Sorted prefix: indices 0 through i - 1 are in final order before pass i begins.",
    "Key element: the value at index i that will be inserted into the sorted partition.",
    "Right-to-left scan: compare the key with sorted elements and shift larger values right.",
    "In-place insertion: only a constant amount of extra memory is needed for indices and the key.",
  ],
  complexityRows: [
    { label: "Best Case", value: "O(n)" },
    { label: "Average Case", value: "O(n²)" },
    { label: "Worst Case", value: "O(n²)" },
    { label: "Space", value: "O(1)" },
    { label: "Stability", value: "Stable" },
  ],
  whenToUse: [
    "Small or nearly sorted arrays where adaptive O(n) best-case performance helps.",
    "Educational contexts to illustrate incremental sorting and shifting.",
    "Online sorting scenarios where elements arrive one at a time.",
  ],
};
