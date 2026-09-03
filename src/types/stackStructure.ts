export const STACK_MAX_CAPACITY = 8;

export type StackOperationId = "push" | "pop" | "peek" | "clear";

export type StackPhase =
  | "intro"
  | "push"
  | "pop"
  | "peek"
  | "clear"
  | "complete"
  | "overflow"
  | "underflow";

export type StackItemHighlight =
  | "default"
  | "pushing"
  | "popping"
  | "peeking"
  | "removed"
  | "found"
  | "clearing";

export interface StackItemState {
  id: string;
  value: number;
  highlightState: StackItemHighlight;
  isTop: boolean;
}

export interface StackOperationStep {
  phase: StackPhase;
  operation: StackOperationId;
  items: StackItemState[];
  maxCapacity: number;
  size: number;
  topIndex: number | null;
  returnedValue: number | null;
  statusTitle: string;
  statusDetail: string;
  stepMessage: string;
  stepExplanation: string;
  codeLine: number;
  found: boolean;
  isError: boolean;
}

export interface StackOperationParams {
  value: number;
}
