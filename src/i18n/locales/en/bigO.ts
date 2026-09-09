export const bigO = {
  backToVisualizer: "Back to Visualizer",
  title: "Big-O Notation",
  subtitle:
    "Big-O describes how an algorithm's time or space requirements scale as input size grows. It helps you compare solutions, predict performance, and choose the right tool for real-world software problems.",
  dimensionTabsAria: "Complexity dimension",
  time: {
    label: "Time Complexity",
    intro:
      "Time complexity measures how the number of operations grows as input size increases. It answers: how much longer will this algorithm take when the dataset doubles?",
    chartTitle: "Time Growth Comparison",
    chartDescription:
      "As input size increases, some time complexity classes explode while others stay manageable. Lower curves mean faster algorithms at scale.",
    tableTitle: "Time Complexity Reference",
    rows: [
      {
        notation: "O(1)",
        name: "Constant",
        description: "Runtime stays flat regardless of input size.",
        examples: "Hash table lookup, array index access",
      },
      {
        notation: "O(log n)",
        name: "Logarithmic",
        description: "Each step eliminates a large fraction of the remaining work.",
        examples: "Binary search on a sorted array",
      },
      {
        notation: "O(n)",
        name: "Linear",
        description: "Runtime grows in direct proportion to input size.",
        examples: "Linear search through an unsorted array",
      },
      {
        notation: "O(n log n)",
        name: "Linearithmic",
        description: "Slightly worse than linear, but still scalable for large data.",
        examples: "Merge sort, Quicksort (average), heap sort",
      },
      {
        notation: "O(n²)",
        name: "Quadratic",
        description: "Doubling input size can quadruple the runtime.",
        examples: "Bubble sort, selection sort, nested loops",
      },
    ],
  },
  space: {
    label: "Space Complexity",
    intro:
      "Space complexity measures how much extra memory an algorithm needs beyond the input itself. It answers: how much additional RAM is required as the dataset grows?",
    chartTitle: "Space Growth Comparison",
    chartDescription:
      "Extra memory can come from recursion depth or auxiliary structures. In-place algorithms keep the lowest space footprint.",
    tableTitle: "Space Complexity Reference",
    auxiliaryTitle: "What Uses Auxiliary Memory?",
    auxiliaryIntro:
      "Space complexity counts memory beyond the input itself. Two common sources are the recursion call stack and temporary data structures allocated during execution.",
    auxiliaryPoints: [
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
    ],
    rows: [
      {
        notation: "O(1)",
        name: "Constant",
        description: "Uses a fixed amount of extra memory regardless of input size.",
        examples: "Iterative binary search, in-place bubble sort",
      },
      {
        notation: "O(log n)",
        name: "Logarithmic",
        description: "Extra memory grows with recursion depth, not input size directly.",
        examples: "Recursive call stack (e.g. recursive binary search)",
      },
      {
        notation: "O(n)",
        name: "Linear",
        description: "Requires auxiliary structures that scale with input size.",
        examples: "Auxiliary arrays, hash maps, merge sort buffer",
      },
    ],
  },
  table: {
    notation: "Notation",
    class: "Class",
    behavior: "Behavior",
    examples: "Examples",
  },
} as const;
