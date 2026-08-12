export type PointerId = "low" | "mid" | "high";

export type CellHighlight = "default" | "eliminated" | "comparing" | "found";

export interface ArrayPointer {
  id: PointerId;
  index: number;
}

export interface ArrayCellState {
  value: number;
  highlight: CellHighlight;
}
