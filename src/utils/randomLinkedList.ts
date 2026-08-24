import { generateRandomArray } from "./randomArray";

export interface RandomLinkedListDataset {
  values: number[];
  operationValue: number;
  searchTarget: number;
  operationIndex: number;
}

export function createRandomLinkedListDataset(size: number): RandomLinkedListDataset {
  const values = generateRandomArray(size);
  const searchTarget =
    values[Math.floor(Math.random() * values.length)] ?? values[0] ?? 1;

  return {
    values,
    operationValue: Math.floor(Math.random() * 99) + 1,
    searchTarget,
    operationIndex: Math.floor(size / 2),
  };
}
