import { AlgorithmExplanationContent } from "./AlgorithmExplanationContent";

const keyConcepts = [
  "Sorted prefix: indices 0 through i - 1 are locked in final order after each pass.",
  "Outer index i: marks the boundary between the sorted prefix and unsorted suffix.",
  "Minimum scan: minIdx tracks the smallest value found during the inner loop.",
  "In-place swaps: only a constant amount of extra memory is needed beyond the array.",
];

const complexityRows = [
  { label: "Best Case", value: "O(n²)" },
  { label: "Average Case", value: "O(n²)" },
  { label: "Worst Case", value: "O(n²)" },
  { label: "Space", value: "O(1)" },
  { label: "Stability", value: "Unstable" },
];

const whenToUse = [
  "Small arrays where simplicity matters more than raw performance.",
  "Educational contexts to illustrate in-place selection and comparison passes.",
  "Memory-constrained environments where O(1) auxiliary space is required.",
];

export function SelectionSortExplanationPanel() {
  return (
    <AlgorithmExplanationContent
      howItWorks="Selection Sort maintains a sorted prefix on the left and an unsorted suffix on the right. Each outer pass scans the unsorted region for the minimum value and swaps it into the next sorted position."
      keyConcepts={keyConcepts}
      complexityRows={complexityRows}
      whenToUse={whenToUse}
    />
  );
}
