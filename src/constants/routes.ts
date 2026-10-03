export const APP_ROUTES = {
  catalog: "/",
  array: "/array",
  linkedList: "/linked-list",
  stack: "/stack",
  binarySearch: "/binary-search",
  selectionSort: "/selection-sort",
  insertionSort: "/insertion-sort",
  mergeSort: "/merge-sort",
  quickSort: "/quick-sort",
  sequentialSearch: "/sequential-search",
  bigONotation: "/big-o-notation",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export type VisualizerRoute =
  | typeof APP_ROUTES.array
  | typeof APP_ROUTES.linkedList
  | typeof APP_ROUTES.stack
  | typeof APP_ROUTES.binarySearch
  | typeof APP_ROUTES.sequentialSearch
  | typeof APP_ROUTES.selectionSort
  | typeof APP_ROUTES.insertionSort
  | typeof APP_ROUTES.mergeSort
  | typeof APP_ROUTES.quickSort;

/** @deprecated Use APP_ROUTES */
export const ROUTE_PATHS = APP_ROUTES;
