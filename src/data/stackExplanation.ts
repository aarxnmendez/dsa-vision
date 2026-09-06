import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export const stackExplanation: AlgorithmExplanationData = {
  howItWorks:
    "A stack is a linear LIFO (Last In, First Out) data structure. Elements are added and removed strictly from the top. Push inserts an element onto the top, pop removes the most recent element, and peek accesses the top element without mutating the stack.",
  keyConcepts: [
    "LIFO order: the most recently pushed element is removed first.",
    "Top pointer: push, pop, and peek all reference the top index in O(1) time.",
    "Bounded capacity: pushing onto a full stack triggers overflow.",
    "Underflow: pop or peek on an empty stack is invalid and must not mutate the structure.",
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
