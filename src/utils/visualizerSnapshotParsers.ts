import type { PivotStrategy } from "../algorithms/quickSort";
import type { ArrayOperationId } from "../types/arrayStructure";
import type {
  LinkedListOperationId,
  LinkedListType,
} from "../types/linkedListStructure";
import type { QueueOperationId } from "../types/queueStructure";
import { QUEUE_MAX_CAPACITY } from "../types/queueStructure";
import type { StackOperationId } from "../types/stackStructure";
import { STACK_MAX_CAPACITY } from "../types/stackStructure";
import type { QueueDataset } from "./randomQueue";
import type { RandomArrayDataset } from "./randomArray";
import type { RandomLinkedListDataset } from "./randomLinkedList";
import type { RandomStackDataset } from "./randomStack";
import {
  asNumber,
  asNumberArray,
  asOneOf,
  asRecord,
} from "./visualizerSnapshot";

const ARRAY_OPERATION_IDS: readonly ArrayOperationId[] = [
  "access",
  "linear-search",
  "insert-start",
  "insert-middle",
  "insert-end",
  "delete-start",
  "delete-middle",
  "delete-end",
];

const LINKED_LIST_TYPES: readonly LinkedListType[] = [
  "singly",
  "doubly",
  "circular",
];

const LINKED_LIST_OPERATION_IDS: readonly LinkedListOperationId[] = [
  "insert-at-head",
  "insert-at-tail",
  "insert-at-index",
  "delete-head",
  "delete-tail",
  "delete-value",
  "search",
  "reverse",
];

const STACK_OPERATION_IDS: readonly StackOperationId[] = [
  "push",
  "pop",
  "peek",
  "clear",
];

const QUEUE_OPERATION_IDS: readonly QueueOperationId[] = [
  "enqueue",
  "dequeue",
  "peek",
  "clear",
];

const PIVOT_STRATEGIES: readonly PivotStrategy[] = [
  "first",
  "middle",
  "last",
  "random",
];

export interface ArraySnapshot {
  arraySize: number;
  dataset: RandomArrayDataset;
  operation: ArrayOperationId;
  operationIndex: number;
}

export function parseArraySnapshot(raw: unknown): ArraySnapshot | null {
  const root = asRecord(raw);
  const dataset = asRecord(root?.dataset);
  const array = asNumberArray(dataset?.array);
  const searchTarget = asNumber(dataset?.searchTarget);
  const operationValue = asNumber(dataset?.operationValue);
  const operation = asOneOf(root?.operation, ARRAY_OPERATION_IDS);
  const operationIndex = asNumber(root?.operationIndex);
  const arraySize = asNumber(root?.arraySize);

  if (
    !array ||
    searchTarget === null ||
    operationValue === null ||
    !operation ||
    operationIndex === null ||
    arraySize === null
  ) {
    return null;
  }

  return {
    arraySize,
    dataset: { array, searchTarget, operationValue },
    operation,
    operationIndex,
  };
}

export interface LinkedListSnapshot {
  listSize: number;
  listType: LinkedListType;
  dataset: RandomLinkedListDataset;
  operation: LinkedListOperationId;
}

export function parseLinkedListSnapshot(
  raw: unknown,
): LinkedListSnapshot | null {
  const root = asRecord(raw);
  const dataset = asRecord(root?.dataset);
  const values = asNumberArray(dataset?.values);
  const operationValue = asNumber(dataset?.operationValue);
  const searchTarget = asNumber(dataset?.searchTarget);
  const operationIndex = asNumber(dataset?.operationIndex);
  const listType = asOneOf(root?.listType, LINKED_LIST_TYPES);
  const operation = asOneOf(root?.operation, LINKED_LIST_OPERATION_IDS);
  const listSize = asNumber(root?.listSize);

  if (
    !values ||
    operationValue === null ||
    searchTarget === null ||
    operationIndex === null ||
    !listType ||
    !operation ||
    listSize === null
  ) {
    return null;
  }

  return {
    listSize,
    listType,
    dataset: { values, operationValue, searchTarget, operationIndex },
    operation,
  };
}

export interface StackSnapshot {
  stackSize: number;
  dataset: RandomStackDataset;
  operation: StackOperationId;
}

export function parseStackSnapshot(raw: unknown): StackSnapshot | null {
  const root = asRecord(raw);
  const dataset = asRecord(root?.dataset);
  const values = asNumberArray(dataset?.values);
  const pushValue = asNumber(dataset?.pushValue);
  const operation = asOneOf(root?.operation, STACK_OPERATION_IDS);
  const stackSize = asNumber(root?.stackSize);

  if (!values || pushValue === null || !operation || stackSize === null) {
    return null;
  }

  return {
    stackSize,
    dataset: { values: values.slice(0, STACK_MAX_CAPACITY), pushValue },
    operation,
  };
}

export interface QueueSnapshot {
  queueSize: number;
  dataset: QueueDataset;
  operation: QueueOperationId;
}

export function parseQueueSnapshot(raw: unknown): QueueSnapshot | null {
  const root = asRecord(raw);
  const dataset = asRecord(root?.dataset);
  const values = asNumberArray(dataset?.values);
  const enqueueValue = asNumber(dataset?.enqueueValue);
  const operation = asOneOf(root?.operation, QUEUE_OPERATION_IDS);
  const queueSize = asNumber(root?.queueSize);

  if (!values || enqueueValue === null || !operation || queueSize === null) {
    return null;
  }

  return {
    queueSize,
    dataset: { values: values.slice(0, QUEUE_MAX_CAPACITY), enqueueValue },
    operation,
  };
}

export interface SearchSnapshot {
  arraySize: number;
  dataset: { array: number[]; target: number };
}

export function parseSearchSnapshot(raw: unknown): SearchSnapshot | null {
  const root = asRecord(raw);
  const dataset = asRecord(root?.dataset);
  const array = asNumberArray(dataset?.array);
  const target = asNumber(dataset?.target);
  const arraySize = asNumber(root?.arraySize);

  if (!array || target === null || arraySize === null) {
    return null;
  }

  return { arraySize, dataset: { array, target } };
}

export interface SortSnapshot {
  arraySize: number;
  array: number[];
}

export function parseSortSnapshot(raw: unknown): SortSnapshot | null {
  const root = asRecord(raw);
  const array = asNumberArray(root?.array);
  const arraySize = asNumber(root?.arraySize);

  if (!array || arraySize === null) {
    return null;
  }

  return { arraySize, array };
}

export interface QuickSortSnapshot extends SortSnapshot {
  pivotStrategy: PivotStrategy;
}

export function parseQuickSortSnapshot(raw: unknown): QuickSortSnapshot | null {
  const sort = parseSortSnapshot(raw);
  const pivotStrategy = asOneOf(asRecord(raw)?.pivotStrategy, PIVOT_STRATEGIES);

  return sort && pivotStrategy ? { ...sort, pivotStrategy } : null;
}
