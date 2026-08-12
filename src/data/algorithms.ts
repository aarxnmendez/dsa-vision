import type { AlgorithmMeta } from "../types/algorithm";

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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJnYa081i6v17_UiS8fCfudWXnKGN52JxRo8zyUCNjNF2l8qZ_jSW59-At-F18WGAm80JJRMceCE98SCnJYl12DOYgdl6TQIpv6mH3t3wQmNKyddQuE99OSrRkD5HiMNHUCpnK5MJkTgC6qnf8AyyElZxAT7mBukHZ1xCH7KJMiIAlnM5tVV80Kxl1U-6MFZPM93n3-weSZlYaXtnpHSWE7eTs7_5Ii5cuSR8gDVSPlTsAcUaKJdai",
    imageBg: "bg-primary-fixed",
    route: "/binary-search",
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
    route: "#",
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
    route: "#",
  },
];
