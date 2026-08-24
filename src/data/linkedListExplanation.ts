import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export const linkedListExplanation: AlgorithmExplanationData = {
  howItWorks:
    "A linked list stores elements in nodes scattered across memory. Each node holds a value and pointer(s) to neighbors instead of sitting in one contiguous block. The head pointer marks the entry point; traversal follows next (and prev in doubly lists) until null or back to head in circular variants.",
  keyConcepts: [
    "Nodes & pointers: data lives in node objects linked by address references.",
    "Singly linked: each node stores value + next — minimal memory, forward-only traversal.",
    "Doubly linked: adds prev for O(1) backward steps at the cost of extra pointer space.",
    "Circular: tail.next wraps to head — useful for round-robin buffers and ring iterators.",
    "No random access: reaching index i requires O(i) pointer hops from the head.",
  ],
  complexityRows: [
    { label: "Insert at Head / Tail", value: "O(1) with head & tail pointers" },
    { label: "Delete at Head", value: "O(1)" },
    { label: "Delete at Tail (Singly)", value: "O(n) — find penultimate node" },
    { label: "Delete at Tail (Doubly)", value: "O(1) with tail pointer" },
    { label: "Search / Access by Index", value: "O(n)" },
    { label: "Reverse (in place)", value: "O(n) time, O(1) space" },
    { label: "Space", value: "O(n) nodes + pointer overhead" },
  ],
  whenToUse: [
    "Frequent insert/delete at the head or at known node references.",
    "Unknown or highly variable size where contiguous reallocation is costly.",
    "Implementing adjacency lists, LRU caches, or playlist-style sequences.",
    "Prefer arrays when you need O(1) index access, cache locality, or binary search on sorted data.",
  ],
};
