export function generateRandomArray(size: number): number[] {
  const values = new Set<number>();

  while (values.size < size) {
    values.add(Math.floor(Math.random() * 99) + 1);
  }

  const array = Array.from(values);

  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }

  return array;
}

export interface RandomArrayDataset {
  array: number[];
  searchTarget: number;
  operationValue: number;
}

export function createRandomArrayDataset(size: number): RandomArrayDataset {
  const array = generateRandomArray(size);
  const searchTarget =
    array[Math.floor(Math.random() * array.length)] ?? array[0] ?? 1;
  const operationValue = Math.floor(Math.random() * 99) + 1;

  return { array, searchTarget, operationValue };
}
