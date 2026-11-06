export const catalog = {
  hero: {
    title: "Explore & Visualize Algorithms",
    subtitle:
      "Master Data Structures and Algorithms with interactive, gamified visualizers. Learning made tactile.",
    bigOLink: "New to Big-O? Read the notation guide",
  },
  search: {
    placeholder: "Search algorithms (e.g. Binary Search)...",
    ariaLabel: "Search algorithms",
  },
  filters: {
    all: "All",
    dataStructures: "Data Structures",
    arrays: "Arrays",
    searching: "Searching",
    sorting: "Sorting",
    trees: "Trees",
    graphs: "Graphs",
    ariaLabel: "Filter by category",
  },
  sections: {
    dataStructures: { title: "Data Structures" },
    searching: { title: "Searching Algorithms" },
    sorting: { title: "Sorting Algorithms" },
  },
  resume: {
    ariaLabel: "Resume your last visualizer",
    label: "Pick up where you left off",
    action: "Continue",
    dismiss: "Dismiss",
  },
  upcoming: {
    title: "Coming soon",
    items: {
      hashTables: {
        title: "Hash Tables",
        description: "Hash functions, collisions, and O(1) average lookups.",
      },
      trees: {
        title: "Trees",
        description: "Binary search trees and traversals.",
      },
      graphs: {
        title: "Graphs",
        description: "BFS, DFS, and Dijkstra's shortest paths.",
      },
    },
  },
  view: {
    ariaLabel: "Catalog view",
    cards: "Cards",
    table: "Compare table",
  },
  table: {
    structuresTitle: "Data structures",
    algorithmsTitle: "Search and sorting algorithms",
    name: "Name",
    access: "Access",
    search: "Search",
    insert: "Insert",
    remove: "Delete",
    space: "Space",
    best: "Best",
    average: "Average",
    worst: "Worst",
    stable: "Stable",
    yes: "Yes",
    no: "No",
    notApplicable: "N/A",
    notes: {
      array: "Array: insert and delete at the end are O(1); in the middle they shift elements, O(n).",
      linkedList: "Linked list: insert and delete are O(1) at the head. Reaching any other position is O(n).",
      stackQueue: "Stack and queue: only the top or front is directly reachable (peek is O(1)); reading an arbitrary element is O(n).",
    },
  },
  emptyResults: "No algorithms match your search.",
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
    queue: {
      title: "Queue",
      description:
        "FIFO queue with O(1) enqueue, dequeue, and peek. Foundation for breadth-first search.",
      complexity: "O(1)",
    },
    "binary-search": {
      title: "Binary Search",
      description:
        "Find an element in a sorted array by repeatedly halving the search interval.",
      complexity: "O(log n)",
    },
    "sequential-search": {
      title: "Linear Search",
      description:
        "Scan from the first index to the last until the target is found or the array ends.",
      complexity: "O(n)",
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
    "merge-sort": {
      title: "Merge Sort",
      description:
        "Recursively divide the array and merge sorted halves with a stable combine step.",
      complexity: "O(n log n)",
    },
    "quick-sort": {
      title: "Quicksort",
      description:
        "Partition around a pivot and recursively sort sub-arrays using divide-and-conquer.",
      complexity: "O(n log n)",
    },
  },
} as const;
