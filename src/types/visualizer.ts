export type PointerId = "low" | "mid" | "high" | "i" | "j" | "min";

export type CellHighlight =
  | "default"
  | "eliminated"
  | "comparing"
  | "found"
  | "sorted"
  | "minimum"
  | "swapping";

export interface ArrayPointer {
  id: PointerId;
  index: number;
}

export interface ArrayCellState {
  value: number;
  highlight: CellHighlight;
}

export type SortBarHighlight =
  | "default"
  | "active"
  | "sorted"
  | "minimum"
  | "comparing"
  | "swapping"
  | "pivot";

export interface SortBarState {
  index: number;
  value: number;
  highlight: SortBarHighlight;
}
