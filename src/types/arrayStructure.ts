import type { ArrayPointer } from "./visualizer";

export type ArrayOperationId =
  | "access"
  | "linear-search"
  | "insert-start"
  | "insert-middle"
  | "insert-end"
  | "delete-start"
  | "delete-middle"
  | "delete-end";

export type ArrayStructurePhase =
  | "intro"
  | "access"
  | "compare"
  | "shift"
  | "write"
  | "complete"
  | "not-found";

export type ArrayStructureHighlight =
  | "default"
  | "accessed"
  | "comparing"
  | "shifting"
  | "shift-source"
  | "shift-target"
  | "inserted"
  | "deleted"
  | "found"
  | "vacant";

export interface ArrayStructureCellState {
  value: number | null;
  highlight: ArrayStructureHighlight;
}

export interface ArrayOperationStep {
  phase: ArrayStructurePhase;
  cells: ArrayStructureCellState[];
  capacity: number;
  operation: ArrayOperationId;
  activeIndex: number | null;
  shiftFromIndex: number | null;
  shiftToIndex: number | null;
  insertedValue: number | null;
  deletedValue: number | null;
  found: boolean;
  statusTitle: string;
  statusDetail: string;
  pointerMovement?: string;
  stepExplanation: string;
  codeLine: number;
  pointers: ArrayPointer[];
}

export interface ArrayOperationParams {
  index: number;
  value: number;
  searchTarget: number;
}
