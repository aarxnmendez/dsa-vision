import { generateRandomArray } from "./randomArray";

export interface RandomStackDataset {
  values: number[];
  pushValue: number;
}

export const DEFAULT_STACK_VALUES = [12, 45, 89] as const;

export function createRandomStackDataset(size: number): RandomStackDataset {
  const values = generateRandomArray(size);

  return {
    values,
    pushValue: Math.floor(Math.random() * 99) + 1,
  };
}

export function createDefaultStackDataset(): RandomStackDataset {
  return {
    values: [...DEFAULT_STACK_VALUES],
    pushValue: 42,
  };
}
