import type { AlgorithmMeta } from "../types/algorithm";
import { APP_ROUTES } from "../constants/routes";

export const algorithms: AlgorithmMeta[] = [
  {
    id: "binary-search",
    title: "Binary Search",
    description:
      "Find an element in a sorted array by repeatedly halving the search interval.",
    complexity: "O(log n)",
    complexityVariant: "success",
    difficulty: "beginner",
    category: "arrays",
    imageUrl: "/images/binary-search-cover.jpg",
    imageBg: "bg-primary-fixed",
    availability: "available",
    route: APP_ROUTES.binarySearch,
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    description:
      "Repeatedly select the smallest element from the unsorted portion and swap it into place.",
    complexity: "O(n²)",
    complexityVariant: "warning",
    difficulty: "beginner",
    category: "sorting",
    imageUrl: "/images/selection-sort-cover.jpg",
    imageBg: "bg-tertiary-fixed",
    availability: "available",
    route: APP_ROUTES.selectionSort,
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    description:
      "Divide array into halves, sort them recursively, and then merge the sorted halves.",
    complexity: "O(n log n)",
    complexityVariant: "error",
    difficulty: "intermediate",
    category: "sorting",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAf8GAgzvu4ElCDezZG9869ysME2kz57jRW5TcHC7cHz5fb3x2q9YWcwiL1SjiN5h29VVX_-MSIdnvDcBcmBW7jG5XHG7pBEYatL_sdkZ0RahLQfaqQaocVdD8zB2y9YbTaKzdVHbxFLwS3SdKpupr1kOjAByhWgOl1wJPt08JA49DcsVyKWOWsn_m7mOYguZnn-69ytUBEVxg0VsgxxXxks_7AlqfjTfCH5-JnGZaEzeaZ9FQsQqur",
    imageBg: "bg-error-container",
    availability: "coming-soon",
  },
  {
    id: "dijkstra",
    title: "Dijkstra's",
    description:
      "Find the shortest paths between nodes in a graph, which may represent, for example, road networks.",
    complexity: "O(V^2)",
    complexityVariant: "tertiary",
    difficulty: "advanced",
    category: "graphs",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2O89TvIijsmES-2vtltSz-YL29mbwePO7mvmRdyKinspxgcpiiLLza6VVENstGkjYZedkH4aSF3KhWuZaHksjeopispw2VSJdPk-Pz8A656Oyg1NMb6LImY2xaTCT2JEunfmZKPz6kebf0l6l5vbKUQ_fa6UWkxbYbnETaE_LPOs0gLZcGXaevbMzaHTN0Tk7MZj6aHP3VxJ7vNhfbDIEWhoJ-bE-OfmTz7Rqb6Hstk_TTMH5fG1C",
    imageBg: "bg-tertiary-fixed",
    availability: "coming-soon",
  },
];
