export const INITIAL_QUEUE_SIZE = 10;
export const QUEUE_MAX_CAPACITY = 20;
export const QUEUE_MIN_CAPACITY = 0;

export type QueueOperationId = "enqueue" | "dequeue" | "peek" | "clear";

export type QueuePhase =
  | "intro"
  | "enqueue"
  | "dequeue"
  | "advance_front"
  | "peek"
  | "clear"
  | "complete"
  | "overflow"
  | "underflow";

export type QueueItemHighlight =
  | "default"
  | "enqueueing"
  | "dequeuing"
  | "outgoing"
  | "peeking"
  | "removed"
  | "found"
  | "clearing";

export interface QueueItemState {
  id: string;
  value: number;
  highlightState: QueueItemHighlight;
  isFront: boolean;
  isRear: boolean;
}

export interface QueueOperationStep {
  phase: QueuePhase;
  operation: QueueOperationId;
  items: Array<QueueItemState | undefined>;
  maxCapacity: number;
  size: number;
  frontIndex: number | null;
  rearIndex: number | null;
  returnedValue: number | null;
  /** Front element value for StatusCard (peek). */
  statusFrontValue?: number | null;
  statusTitle: string;
  statusDetail: string;
  stepMessage: string;
  stepExplanation: string;
  codeLine: number;
  found: boolean;
  isError: boolean;
}

export interface QueueOperationParams {
  value: number;
}
