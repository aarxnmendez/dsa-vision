export type BinarySearchPhase =
  | "initial"
  | "calculate-mid"
  | "compare"
  | "move-pointer"
  | "found"
  | "not-found";

export interface BinarySearchStep {
  phase: BinarySearchPhase;
  low: number;
  high: number;
  mid: number | null;
  showMid: boolean;
  compareMid: boolean;
  found: boolean;
  target: number;
  arrayValue: number;
  statusTitle: string;
  statusDetail: string;
  pointerMovement?: string;
  stepExplanation: string;
  stepFormula?: string;
  codeLine: number;
  movedPointer?: "low" | "high";
}

function createStep(
  partial: Omit<BinarySearchStep, "found"> & { found?: boolean },
): BinarySearchStep {
  return { found: false, ...partial };
}

function createNotFoundStep(
  target: number,
  low: number,
  high: number,
): BinarySearchStep {
  return createStep({
    phase: "not-found",
    low,
    high,
    mid: null,
    showMid: false,
    compareMid: false,
    target,
    arrayValue: -1,
    statusTitle: `Target ${target} not found in the array`,
    statusDetail: "The element does not exist in this sorted array.",
    stepExplanation:
      "The search space is empty. No element matches the target.",
    codeLine: 17,
  });
}

export function binarySearch(
  array: number[],
  target: number,
): BinarySearchStep[] {
  if (array.length === 0) {
    return [createNotFoundStep(target, 0, -1)];
  }

  const steps: BinarySearchStep[] = [];
  let low = 0;
  let high = array.length - 1;

  steps.push(
    createStep({
      phase: "initial",
      low,
      high,
      mid: null,
      showMid: false,
      compareMid: false,
      target,
      arrayValue: -1,
      statusTitle: "Initializing search range",
      statusDetail: `low = ${low}, high = ${high}`,
      stepExplanation:
        "Set low to the first index and high to the last index of the array.",
      codeLine: 2,
    }),
  );

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const arrayValue = array[mid];

    steps.push(
      createStep({
        phase: "calculate-mid",
        low,
        high,
        mid,
        showMid: true,
        compareMid: false,
        target,
        arrayValue,
        statusTitle: "Calculate mid",
        statusDetail: `mid = (${low} + ${high}) // 2 = ${mid}`,
        stepExplanation:
          "Calculate the middle index to divide the search space in half.",
        stepFormula: `mid = (${low} + ${high}) // 2 = ${mid}`,
        codeLine: 6,
      }),
    );

    steps.push(
      createStep({
        phase: "compare",
        low,
        high,
        mid,
        showMid: true,
        compareMid: true,
        target,
        arrayValue,
        statusTitle: `${arrayValue} == ${target}?`,
        statusDetail:
          arrayValue === target
            ? `Yes! ${arrayValue} equals ${target}.`
            : arrayValue < target
              ? `No. ${arrayValue} is less than ${target}.`
              : `No. ${arrayValue} is greater than ${target}.`,
        stepExplanation: "Compare the middle element with the target value.",
        codeLine: 7,
      }),
    );

    if (arrayValue === target) {
      steps.push(
        createStep({
          phase: "found",
          low,
          high,
          mid,
          showMid: true,
          compareMid: true,
          found: true,
          target,
          arrayValue,
          statusTitle: `${arrayValue} == ${target}?`,
          statusDetail: `Found ${target} at index ${mid}.`,
          pointerMovement: `Target confirmed at index ${mid}.`,
          stepExplanation:
            "The middle element matches the target. Search complete.",
          stepFormula: `return ${mid}`,
          codeLine: 8,
        }),
      );
      return steps;
    }

    if (arrayValue < target) {
      const previousLow = low;
      low = mid + 1;

      if (low > high) {
        steps.push(createNotFoundStep(target, low, high));
        return steps;
      }

      steps.push(
        createStep({
          phase: "move-pointer",
          low,
          high,
          mid: null,
          showMid: false,
          compareMid: false,
          target,
          arrayValue,
          statusTitle: "Move low pointer",
          statusDetail: `Discard the left half. Search continues from index ${low} to ${high}.`,
          pointerMovement: `low moves from index ${previousLow} to index ${low}.`,
          stepExplanation:
            "The middle value is smaller than the target, so search the right half.",
          movedPointer: "low",
          codeLine: 10,
        }),
      );
    } else {
      const previousHigh = high;
      high = mid - 1;

      if (low > high) {
        steps.push(createNotFoundStep(target, low, high));
        return steps;
      }

      steps.push(
        createStep({
          phase: "move-pointer",
          low,
          high,
          mid: null,
          showMid: false,
          compareMid: false,
          target,
          arrayValue,
          statusTitle: "Move high pointer",
          statusDetail: `Discard the right half. Search continues from index ${low} to ${high}.`,
          pointerMovement: `high moves from index ${previousHigh} to index ${high}.`,
          stepExplanation:
            "The middle value is larger than the target, so search the left half.",
          movedPointer: "high",
          codeLine: 12,
        }),
      );
    }
  }

  steps.push(createNotFoundStep(target, low, high));
  return steps;
}

export function generateSortedArray(size: number): number[] {
  if (size <= 0) {
    return [];
  }

  const values = new Set<number>();
  const upperBound = Math.max(99, size * 3);

  while (values.size < size) {
    values.add(Math.floor(Math.random() * upperBound) + 1);
  }

  return Array.from(values).sort((a, b) => a - b);
}
