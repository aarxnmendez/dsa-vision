export const APP_ROUTES = {
  catalog: "/",
  array: "/array",
  binarySearch: "/binary-search",
  selectionSort: "/selection-sort",
  bigONotation: "/big-o-notation",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export type VisualizerRoute =
  | typeof APP_ROUTES.array
  | typeof APP_ROUTES.binarySearch
  | typeof APP_ROUTES.selectionSort;
