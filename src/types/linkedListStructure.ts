export type LinkedListType = "singly" | "doubly" | "circular";

export type LinkedListOperationId =
  | "insert-at-head"
  | "insert-at-tail"
  | "insert-at-index"
  | "delete-head"
  | "delete-tail"
  | "delete-value"
  | "search"
  | "reverse";

export type LinkedListPhase =
  | "intro"
  | "traverse"
  | "compare"
  | "insert"
  | "delete"
  | "relink"
  | "complete"
  | "not-found";

export type LinkedListNodeHighlight =
  | "default"
  | "active"
  | "accessed"
  | "comparing"
  | "creating"
  | "inserted"
  | "deleted"
  | "found";

export type LinkedListFloatingPlacement = "before-head" | "after-tail";

export type LinkedListConnectionLabel = "next" | "prev";

export type LinkedListConnectionState =
  | "idle"
  | "traversing"
  | "relinking"
  | "breaking"
  | "active";

export interface LinkedListNodeState {
  id: string;
  value: number;
  highlightState: LinkedListNodeHighlight;
  isHead: boolean;
  isTail: boolean;
  showNewLabel?: boolean;
  nextIsNull?: boolean;
  prevIsNull?: boolean;
  inlinePlacement?: LinkedListFloatingPlacement;
}

export interface LinkedListConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label: LinkedListConnectionLabel;
  state: LinkedListConnectionState;
}

export type LinkedListPointerId = "head" | "curr" | "prev" | "temp" | "tail";

export interface LinkedListPointer {
  id: LinkedListPointerId;
  nodeId: string;
}

export interface LinkedListOperationStep {
  phase: LinkedListPhase;
  listType: LinkedListType;
  nodes: LinkedListNodeState[];
  connections: LinkedListConnection[];
  operation: LinkedListOperationId;
  statusTitle: string;
  statusDetail: string;
  stepMessage: string;
  stepExplanation: string;
  codeLine: number;
  pointers: LinkedListPointer[];
  found: boolean;
}

export interface LinkedListOperationParams {
  index: number;
  value: number;
  searchTarget: number;
}
