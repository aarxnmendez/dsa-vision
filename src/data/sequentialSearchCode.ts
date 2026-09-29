import type { CodeLanguage } from "./binarySearchCode";

export const sequentialSearchCode: Record<CodeLanguage, string[]> = {
  python: [
    "def linear_search(arr, target):",
    "    for i in range(len(arr)):",
    "        if arr[i] == target:",
    "            return i",
    "    return -1",
  ],
  javascript: [
    "function linearSearch(arr, target) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    if (arr[i] === target) {",
    "      return i;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  java: [
    "public static int linearSearch(int[] arr, int target) {",
    "    for (int i = 0; i < arr.length; i++) {",
    "        if (arr[i] == target) {",
    "            return i;",
    "        }",
    "    }",
    "    return -1;",
    "}",
  ],
  pseudocode: [
    "LINEAR-SEARCH(A, target)",
    "    for i = 0 to length(A) - 1",
    "        if A[i] == target",
    "            return i",
    "    return NOT-FOUND",
  ],
};
