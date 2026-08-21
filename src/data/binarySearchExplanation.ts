import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export const binarySearchExplanation: AlgorithmExplanationData = {
  howItWorks:
    "Binary search repeatedly halves a sorted array to locate a target value. Start with low and high covering the full array, compute mid, compare array[mid] with the target, then discard the left or right half and repeat until the target is found or the range becomes empty.",
  keyConcepts: [
    "Sorted array: binary search only works when elements are in ascending order.",
    "Pointers low / mid / high: track the active search interval and the middle candidate.",
    "Divide and conquer: each step halves the search space by comparing against the midpoint.",
  ],
  complexityRows: [
    { label: "Best Case", value: "O(1)" },
    { label: "Average Case", value: "O(log n)" },
    { label: "Worst Case", value: "O(log n)" },
    { label: "Space", value: "O(1)" },
  ],
  whenToUse: [
    "Searching sorted arrays with O(1) random access, such as static lookup tables.",
    "Large datasets where a linear scan would be too slow and memory is limited.",
    "Repeated lookups on the same ordered collection (e.g. dictionaries, indexes).",
  ],
};
