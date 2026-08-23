import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export const arrayExplanation: AlgorithmExplanationData = {
  howItWorks:
    "An array stores elements in a single contiguous block of memory. Each slot has a fixed index starting at 0, so the machine can jump directly to any position using base address + offset. That makes reading by index extremely fast, but inserting or deleting away from the end forces neighboring elements to shift and make room.",
  keyConcepts: [
    "Contiguous memory: indices 0, 1, 2... map to adjacent slots in RAM.",
    "O(1) index access: arr[i] computes the address in one step without scanning.",
    "O(n) shifts: inserting or deleting in the middle moves up to n - 1 elements.",
    "Linear search: when you do not know the index, you must inspect elements one by one.",
  ],
  complexityRows: [
    { label: "Access by Index", value: "O(1)" },
    { label: "Linear Search", value: "O(n)" },
    { label: "Insert / Delete (end)", value: "O(1)" },
    { label: "Insert / Delete (middle)", value: "O(n)" },
    { label: "Space", value: "O(n)" },
  ],
  whenToUse: [
    "Frequent random access by index, such as lookup tables or buffers.",
    "Sequential iteration when cache locality and memory density matter.",
    "Avoid heavy insert/delete in the middle when performance is critical — consider linked structures instead.",
  ],
};
