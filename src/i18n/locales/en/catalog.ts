export const catalog = {
  hero: {
    title: "Explore & Visualize Algorithms",
    subtitle:
      "Master Data Structures and Algorithms with interactive, gamified visualizers. Learning made tactile.",
  },
  search: {
    placeholder: "Search algorithms (e.g. Binary Search)...",
  },
  filters: {
    all: "All",
    dataStructures: "Data Structures",
    arrays: "Arrays",
    searching: "Searching",
    sorting: "Sorting",
    trees: "Trees",
    graphs: "Graphs",
  },
  categories: {
    array: "Array",
    "data-structures": "Data Structure",
    searching: "Searching",
    sorting: "Sorting",
    trees: "Trees",
    graphs: "Graphs",
  },
  algorithms: {
    array: {
      title: "Array",
      description:
        "Contiguous memory block with O(1) index access and O(n) insert/delete shifts.",
      complexity: "O(1)–O(n)",
    },
    "linked-list": {
      title: "Linked List",
      description:
        "Pointer-based nodes supporting singly, doubly, and circular variants with O(1) head ops.",
      complexity: "O(1)–O(n)",
    },
    stack: {
      title: "Stack",
      description:
        "LIFO stack with O(1) push, pop, and peek. Bounded capacity triggers overflow.",
      complexity: "O(1)–O(n)",
    },
    "binary-search": {
      title: "Binary Search",
      description:
        "Find an element in a sorted array by repeatedly halving the search interval.",
      complexity: "O(log n)",
    },
    "selection-sort": {
      title: "Selection Sort",
      description:
        "Repeatedly select the smallest element from the unsorted portion and swap it into place.",
      complexity: "O(n²)",
    },
    "insertion-sort": {
      title: "Insertion Sort",
      description:
        "Build a sorted prefix by inserting each element into its correct position with right-to-left shifts.",
      complexity: "O(n²)",
    },
    "quick-sort": {
      title: "Quicksort",
      description:
        "Partition around a pivot and recursively sort sub-arrays using divide-and-conquer.",
      complexity: "O(n log n) avg",
    },
  },
} as const;
