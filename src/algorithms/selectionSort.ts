export interface SelectionSortStep {
  array: number[];
  sortedBoundary: number;
  minIdx: number;
  comparingIdx: number | null;
  swapIndices: [number, number] | null;
  comparisons: number;
  swaps: number;
  activeLine: number;
  statusTitle: string;
  statusDetail: string;
  stepExplanation: string;
  isComplete?: boolean;
}

function createStep(
  partial: Omit<
    SelectionSortStep,
    "stepExplanation" | "comparisons" | "swaps"
  > & {
    stepExplanation: string;
    comparisons: number;
    swaps: number;
  },
): SelectionSortStep {
  return {
    ...partial,
  };
}

function compareStatusDetail(
  current: number,
  minimum: number,
  minIdx: number,
  comparingIdx: number,
  isLess: boolean,
): string {
  if (isLess) {
    return `${current} < ${minimum}. A smaller value was found at index ${comparingIdx}.`;
  }

  if (current > minimum) {
    return `${current} > ${minimum}. The current minimum remains ${minimum} at index ${minIdx}.`;
  }

  return `${current} == ${minimum}. The current minimum remains ${minimum} at index ${minIdx}.`;
}

export function generateSelectionSortSteps(input: number[]): SelectionSortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SelectionSortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  if (n === 0) {
    return steps;
  }

  if (n === 1) {
    steps.push(
      createStep({
        array: [...arr],
        sortedBoundary: 1,
        minIdx: 0,
        comparingIdx: null,
        swapIndices: null,
        activeLine: 14,
        statusTitle: "Sorting complete",
        statusDetail: "The array is fully sorted in ascending order.",
        stepExplanation: "Array completely sorted!",
        isComplete: true,
        comparisons,
        swaps,
      }),
    );
    return steps;
  }

  steps.push(
    createStep({
      array: [...arr],
      sortedBoundary: 0,
      minIdx: 0,
      comparingIdx: null,
      swapIndices: null,
      comparisons,
      swaps,
      activeLine: 1,
      statusTitle: "Initializing",
      statusDetail: `${n}-element unsorted array. Sorted boundary at index 0.`,
      stepExplanation:
        "Initialize: no elements are locked in their final position yet.",
    }),
  );

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push(
      createStep({
        array: [...arr],
        sortedBoundary: i,
        minIdx: i,
        comparingIdx: null,
        swapIndices: null,
        comparisons,
        swaps,
        activeLine: 4,
        statusTitle: `Starting pass ${i + 1}`,
        statusDetail: `Initial minimum: ${arr[i]} at index ${i}.`,
        stepExplanation: `Starting pass ${i + 1}: search for the minimum from index ${i}. Set minIdx = ${i} (value ${arr[i]}).`,
      }),
    );

    for (let j = i + 1; j < n; j++) {
      comparisons += 1;
      const currentValue = arr[j];
      const minimumValue = arr[minIdx];
      const isLess = currentValue < minimumValue;

      steps.push(
        createStep({
          array: [...arr],
          sortedBoundary: i,
          minIdx,
          comparingIdx: j,
          swapIndices: null,
          comparisons,
          swaps,
          activeLine: 6,
          statusTitle: `Comparing ${currentValue} and ${minimumValue}`,
          statusDetail: compareStatusDetail(
            currentValue,
            minimumValue,
            minIdx,
            j,
            isLess,
          ),
          stepExplanation: isLess
            ? `Scanning index ${j} (value: ${currentValue}). Value ${currentValue} is less than current minimum ${minimumValue}.`
            : `Scanning index ${j} (value: ${currentValue}). Value ${currentValue} is not less than current minimum ${minimumValue}. minIdx stays at ${minIdx}.`,
        }),
      );

      if (isLess) {
        const previousMinimum = minimumValue;
        minIdx = j;
        steps.push(
          createStep({
            array: [...arr],
            sortedBoundary: i,
            minIdx,
            comparingIdx: j,
            swapIndices: null,
            comparisons,
            swaps,
            activeLine: 7,
            statusTitle: "New minimum found",
            statusDetail: `${currentValue} < ${previousMinimum}. Updated current minimum to ${currentValue} at index ${j}.`,
            stepExplanation: `New minimum found at index ${j} (value: ${currentValue}). minIdx updates to ${j}.`,
          }),
        );
      }
    }

    if (minIdx !== i) {
      swaps += 1;
      const valueAtOuterIndex = arr[i];
      const minimumValue = arr[minIdx];

      steps.push(
        createStep({
          array: [...arr],
          sortedBoundary: i,
          minIdx,
          comparingIdx: null,
          swapIndices: [i, minIdx],
          comparisons,
          swaps,
          activeLine: 11,
          statusTitle: "Placing minimum",
          statusDetail: `Swapping ${minimumValue} with ${valueAtOuterIndex} to fix position [${i}].`,
          stepExplanation: `Swapping index ${i} (value ${valueAtOuterIndex}) and minimum index ${minIdx} (value ${minimumValue}). Place ${minimumValue} at index ${i}.`,
        }),
      );

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    const sortedValue = arr[i];
    const passWasSwap = minIdx !== i;
    steps.push(
      createStep({
        array: [...arr],
        sortedBoundary: i + 1,
        minIdx: i,
        comparingIdx: null,
        swapIndices: null,
        comparisons,
        swaps,
        activeLine: 3,
        statusTitle: `Pass ${i + 1} complete`,
        statusDetail: passWasSwap
          ? `Position [${i}] fixed with ${sortedValue}. Indices 0..${i} are sorted.`
          : `${sortedValue} was already at index ${i}. Indices 0..${i} are sorted.`,
        stepExplanation: passWasSwap
          ? `Swap complete. Sub-array [0..${i}] is sorted. Indices 0 through ${i} now hold the ${i + 1} smallest elements in order.`
          : `Minimum was already at index ${i}. Sub-array [0..${i}] is sorted.`,
      }),
    );
  }

  steps.push(
    createStep({
      array: [...arr],
      sortedBoundary: n,
      minIdx: n - 1,
      comparingIdx: null,
      swapIndices: null,
      comparisons,
      swaps,
      activeLine: 14,
      statusTitle: "Sorting complete",
      statusDetail: "The array is fully sorted in ascending order.",
      stepExplanation: "Array completely sorted!",
      isComplete: true,
    }),
  );

  return steps;
}

export function generateUnsortedArray(size: number): number[] {
  const values = new Set<number>();

  while (values.size < size) {
    values.add(Math.floor(Math.random() * 99) + 1);
  }

  const array = Array.from(values);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
