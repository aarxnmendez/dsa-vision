export interface BinarySearchStep {
  low: number;
  high: number;
  mid: number;
  found: boolean;
  description: string;
}

export function binarySearch(
  array: number[],
  target: number,
): BinarySearchStep[] {
  const steps: BinarySearchStep[] = [];

  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const isFound = array[mid] === target;

    steps.push({
      low: left,
      high: right,
      mid,
      found: isFound,
      description: isFound
        ? `¡Encontrado! El número ${target} está en la posición ${mid}.`
        : `Evaluando posición ${mid} (valor ${array[mid]}).`,
    });

    if (isFound) {
      break;
    } else if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return steps;
}
