export const pages = {
  binarySearch: {
    title: "Binary Search",
    description:
      "Divide-and-conquer search on a sorted array by halving the active interval each step.",
    customInputHint: "Values are automatically sorted for Binary Search.",
    complexity: {
      time: {
        title: "Logarithmic Time",
        text: "Execution time grows logarithmically relative to the input size. By halving the search space at each step, it remains exceptionally fast even for massive datasets.",
      },
      space: {
        title: "Constant Space",
        text: "The algorithm uses a fixed amount of additional memory (pointers only), regardless of the array size.",
      },
    },
  },
  sequentialSearch: {
    title: "Linear Search",
    description:
      "Walk the array from the first index to the last, comparing each element with the target.",
    customInputHint:
      "Enter values in any order. The array is not sorted for linear search.",
    complexity: {
      time: {
        title: "Linear time",
        text: "In the worst case every element is inspected once, so runtime grows proportionally with array length: O(n).",
      },
      space: {
        title: "Constant space",
        text: "Only the loop index and a few variables are needed: O(1) auxiliary space.",
      },
    },
  },
  selectionSort: {
    title: "Selection Sort",
    description:
      "In-place comparison sort that selects the minimum each pass and swaps it forward.",
    customInputHint: "Enter values in any order. Selection Sort will sort them in place.",
    complexity: {
      time: {
        title: "Quadratic Time",
        text: "Selection Sort compares elements across nested loops, resulting in O(n²) time in typical cases.",
      },
      space: {
        title: "Constant Space",
        text: "The algorithm sorts in place using only a constant amount of extra memory for indices and swaps.",
      },
    },
  },
  insertionSort: {
    title: "Insertion Sort",
    description:
      "In-place comparison sort that inserts each element into the growing sorted prefix on the left.",
    customInputHint: "Enter values in any order. Insertion Sort will sort them in place.",
    complexity: {
      time: {
        title: "Adaptive Quadratic Time",
        text: "Insertion Sort runs in O(n) time on already sorted input and O(n²) in average and worst cases due to nested comparisons and shifts.",
      },
      space: {
        title: "Constant Space",
        text: "The algorithm sorts in place using only a constant amount of extra memory for the key and loop indices.",
      },
    },
  },
  mergeSort: {
    title: "Merge Sort",
    description:
      "Stable divide-and-conquer sort that merges sorted sub-arrays with auxiliary buffer space.",
    customInputHint:
      "Enter 4 to 20 values in any order. Merge Sort uses extra space while merging levels of the recursion tree.",
    headerComplexity: {
      time: "O(n log n)",
      space: "O(n)",
    },
    complexity: {
      time: {
        title: "Log-linear time",
        text: "Merge Sort always runs in O(n log n) time because each level processes all n elements once across log n divide levels.",
      },
      space: {
        title: "Linear auxiliary space",
        text: "The merge step copies elements into auxiliary buffers, requiring O(n) extra space for typical top-down implementations.",
      },
    },
  },
  quickSort: {
    title: "Quicksort",
    description:
      "Divide-and-conquer sort that partitions around a pivot and recursively sorts sub-arrays.",
    customInputHint: "Enter values in any order. Quicksort will sort them in place.",
    headerComplexity: {
      time: "O(n log n)",
      space: "O(log n)",
    },
    complexity: {
      time: {
        title: "Logarithmic Average Time",
        text: "Randomized Quicksort picks a random pivot each partition, keeping expected recursion depth at O(log n). Average and best cases run in O(n log n) time; a rare unlucky pivot sequence can still reach O(n²).",
      },
      space: {
        title: "Logarithmic Recursion Stack",
        text: "The in-place partition uses O(1) auxiliary memory, but recursive calls consume O(log n) stack space on average and O(n) in the worst case.",
      },
    },
  },
  array: {
    title: "Array",
    description:
      "Contiguous memory structure with O(1) index access and O(n) shifts for insertions and deletions.",
    complexity: {
      time: {
        title: "Mixed Complexity",
        text: "Index access is O(1), but insertions and deletions away from the end may shift up to n elements, costing O(n) time.",
      },
      space: {
        title: "Contiguous Storage",
        text: "Elements are stored in adjacent memory slots. The structure uses O(n) space for n values plus any reserved capacity.",
      },
    },
  },
  linkedList: {
    title: "Linked List",
    description:
      "Pointer-based nodes with singly, doubly, and circular variants supporting O(1) head operations.",
    complexity: {
      time: {
        title: "Pointer-Based Complexity",
        text: "With head and tail pointers, insert at head and insert at tail are O(1). Delete at head is also O(1). Delete at tail stays O(n) in singly linked lists because you must walk to the penultimate node; doubly linked lists achieve O(1) tail deletion. Search, access by index, and reverse remain O(n).",
      },
      space: {
        title: "Node Overhead",
        text: "Each node stores a value plus pointer(s). Doubly linked lists use extra space for prev links but enable O(1) backward traversal.",
      },
    },
  },
  stack: {
    title: "Stack",
    description:
      "LIFO structure with O(1) push, pop, and peek. Bounded capacity triggers overflow on push.",
    complexity: {
      time: {
        title: "Constant Time Operations",
        text: "Push, pop, and peek access only the top pointer, executing in O(1) constant time regardless of element count. Operations requiring full structure traversal, such as clear, run in O(n) time.",
      },
      space: {
        title: "Linear Auxiliary Space",
        text: "Space complexity is O(n) proportional to the maximum stored elements, plus O(1) memory for the top pointer.",
      },
    },
  },
  codeLanguages: {
    python: "Python",
    javascript: "JavaScript",
    java: "Java",
    pseudocode: "Pseudocode",
  },
} as const;
