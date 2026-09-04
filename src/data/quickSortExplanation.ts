import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export const quickSortExplanation: AlgorithmExplanationData = {
  howItWorks:
    "Quicksort applies divide-and-conquer on an array. On each active sub-array, a pivot index is chosen according to a strategy, the array is partitioned so elements less than or equal to the pivot sit on the left and greater elements on the right, then each side is sorted recursively until sub-arrays contain at most one element.",
  keyConcepts: [
    "Divide and Conquer: split the problem into smaller sub-arrays, sort them independently, and combine implicitly through partitioning.",
    "Pivot Selection Impact: always choosing the first or last element on sorted data creates maximally unbalanced partitions and O(n²) recursion depth; middle or random pivots keep the expected O(n log n) average.",
    "Partitioning Process: scan with indices i and j to rearrange elements around the pivot in O(n) time per level.",
    "Recursion Base Case: sub-arrays with zero or one element are already sorted and stop further calls.",
  ],
  complexityRows: [
    { label: "Best Case", value: "O(n log n)" },
    { label: "Average Case", value: "O(n log n)" },
    { label: "Worst Case", value: "O(n²)" },
    { label: "Space", value: "O(log n)" },
    { label: "Stability", value: "Unstable" },
  ],
  whenToUse: [
    "General-purpose in-place sorting when average O(n log n) performance is required.",
    "Large datasets where randomized or middle pivots avoid pathological O(n²) behavior on nearly sorted input.",
    "Systems with limited auxiliary memory where O(log n) recursion stack is acceptable.",
  ],
};
