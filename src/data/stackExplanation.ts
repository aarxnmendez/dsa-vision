import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export const stackExplanation: AlgorithmExplanationData = {
  howItWorks:
    "A stack is a linear LIFO (Last In, First Out) data structure. Elements are added and removed strictly from the top. Push inserts an element onto the top, pop removes the most recent element, and peek accesses the top element without mutating the stack.",
  keyConcepts: [
    "LIFO Discipline: Last In, First Out order ensures that the most recently added element is processed first.",
    "Top Pointer: All active operations reference the top index in O(1) constant time regardless of stack size.",
    "Bounded Capacity: A fixed maximum size triggers a stack overflow error when pushing to a full structure.",
    "Underflow Handling: Executing pop or peek on an empty stack is an invalid operation that returns an underflow error or null without mutating memory.",
  ],
  complexityRows: [
    { label: "Push", value: "O(1)" },
    { label: "Pop", value: "O(1)" },
    { label: "Peek", value: "O(1)" },
    { label: "Clear", value: "O(n)" },
    { label: "Space", value: "O(n)" },
  ],
  whenToUse: [
    "Undo / redo mechanisms and browser history navigation.",
    "Function call stacks during recursion and expression parsing (e.g., postfix evaluation).",
    "Backtracking algorithms and Depth-First Search (DFS) graph traversal.",
  ],
};
