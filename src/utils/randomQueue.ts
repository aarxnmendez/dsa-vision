import { QUEUE_MAX_CAPACITY } from "../types/queueStructure";

export interface QueueDataset {
  values: number[];
  enqueueValue: number;
}

export const DEFAULT_QUEUE_VALUES = [12, 45, 89] as const;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createDefaultQueueDataset(): QueueDataset {
  return {
    values: [...DEFAULT_QUEUE_VALUES],
    enqueueValue: randomInt(1, 99),
  };
}

export function createRandomQueueDataset(size: number): QueueDataset {
  const clampedSize = Math.min(Math.max(size, 0), QUEUE_MAX_CAPACITY);
  const values = Array.from({ length: clampedSize }, () => randomInt(1, 99));
  return {
    values,
    enqueueValue: randomInt(1, 99),
  };
}
