import { generateRandomArray } from "../utils/randomArray";

export interface InsertionSortStep {
  array: number[];
  sortedBoundary: number;
  keyIdx: number;
  keyValue: number;
  comparingIdx: number | null;
  shiftIndices: [number, number] | null;
  insertIndex: number | null;
  comparisons: number;
  shifts: number;
  activeLine: number;
  statusTitle: string;
  statusDetail: string;
  stepExplanation: string;
  isComplete?: boolean;
}

function createStep(
  partial: Omit<
    InsertionSortStep,
    "stepExplanation" | "comparisons" | "shifts"
  > & {
    stepExplanation: string;
    comparisons: number;
    shifts: number;
  },
): InsertionSortStep {
  return {
    ...partial,
  };
}

export function generateInsertionSortSteps(input: number[]): InsertionSortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: InsertionSortStep[] = [];
  let comparisons = 0;
  let shifts = 0;

  if (n === 0) {
    return steps;
  }

  if (n === 1) {
    steps.push(
      createStep({
        array: [...arr],
        sortedBoundary: 1,
        keyIdx: 0,
        keyValue: arr[0],
        comparingIdx: null,
        shiftIndices: null,
        insertIndex: 0,
        activeLine: 12,
        statusTitle: "Sorting complete",
        statusDetail: "The array is fully sorted in ascending order.",
        stepExplanation: "Array completely sorted!",
        isComplete: true,
        comparisons,
        shifts,
      }),
    );
    return steps;
  }

  steps.push(
    createStep({
      array: [...arr],
      sortedBoundary: 1,
      keyIdx: 0,
      keyValue: arr[0],
      comparingIdx: null,
      shiftIndices: null,
      insertIndex: null,
      comparisons,
      shifts,
      activeLine: 1,
      statusTitle: "Initializing",
      statusDetail: `${n}-element array. Index 0 is the initial sorted partition.`,
      stepExplanation:
        "Initialize: the left partition [0] is sorted. The unsorted partition starts at index 1.",
    }),
  );

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    steps.push(
      createStep({
        array: [...arr],
        sortedBoundary: i,
        keyIdx: i,
        keyValue: key,
        comparingIdx: null,
        shiftIndices: null,
        insertIndex: null,
        comparisons,
        shifts,
        activeLine: 4,
        statusTitle: `Selecting key ${key}`,
        statusDetail: `Key ${key} at index ${i}. Sorted partition: indices 0..${i - 1}.`,
        stepExplanation: `Pass ${i}: select key ${key} at index ${i} and insert it into the sorted partition on the left.`,
      }),
    );

    let j = i - 1;

    while (j >= 0) {
      comparisons += 1;
      const compareValue = arr[j];
      const shouldShift = compareValue > key;

      steps.push(
        createStep({
          array: [...arr],
          sortedBoundary: i,
          keyIdx: i,
          keyValue: key,
          comparingIdx: j,
          shiftIndices: null,
          insertIndex: null,
          comparisons,
          shifts,
          activeLine: 6,
          statusTitle: `Comparing ${compareValue} with key ${key}`,
          statusDetail: shouldShift
            ? `${compareValue} > ${key}. Shift ${compareValue} one position to the right.`
            : `${compareValue} <= ${key}. Stop shifting and insert key at index ${j + 1}.`,
          stepExplanation: shouldShift
            ? `Compare key ${key} with ${compareValue} at index ${j}. ${compareValue} is greater, so it will shift right.`
            : `Compare key ${key} with ${compareValue} at index ${j}. ${compareValue} is not greater, so key belongs at index ${j + 1}.`,
        }),
      );

      if (!shouldShift) {
        break;
      }

      shifts += 1;

      steps.push(
        createStep({
          array: [...arr],
          sortedBoundary: i,
          keyIdx: i,
          keyValue: key,
          comparingIdx: j,
          shiftIndices: [j, j + 1],
          insertIndex: null,
          comparisons,
          shifts,
          activeLine: 7,
          statusTitle: `Shifting ${compareValue} to the right`,
          statusDetail: `Move ${compareValue} from index ${j} to index ${j + 1}.`,
          stepExplanation: `Shift ${compareValue} from index ${j} to index ${j + 1} to make room for key ${key}.`,
        }),
      );

      arr[j + 1] = arr[j];
      j -= 1;
    }

    const targetIndex = j + 1;

    steps.push(
      createStep({
        array: [...arr],
        sortedBoundary: i,
        keyIdx: i,
        keyValue: key,
        comparingIdx: null,
        shiftIndices: null,
        insertIndex: targetIndex,
        comparisons,
        shifts,
        activeLine: 9,
        statusTitle: `Inserting key ${key}`,
        statusDetail: `Place key ${key} at index ${targetIndex}.`,
        stepExplanation: `Insert key ${key} at index ${targetIndex}.`,
      }),
    );

    arr[targetIndex] = key;

    steps.push(
      createStep({
        array: [...arr],
        sortedBoundary: i + 1,
        keyIdx: targetIndex,
        keyValue: key,
        comparingIdx: null,
        shiftIndices: null,
        insertIndex: null,
        comparisons,
        shifts,
        activeLine: 3,
        statusTitle: `Pass ${i} complete`,
        statusDetail: `Indices 0..${i} are sorted. Unsorted partition starts at index ${i + 1}.`,
        stepExplanation: `Pass ${i} complete. Sorted partition now covers indices 0 through ${i}.`,
      }),
    );
  }

  steps.push(
    createStep({
      array: [...arr],
      sortedBoundary: n,
      keyIdx: n - 1,
      keyValue: arr[n - 1],
      comparingIdx: null,
      shiftIndices: null,
      insertIndex: null,
      comparisons,
      shifts,
      activeLine: 12,
      statusTitle: "Sorting complete",
      statusDetail: "The array is fully sorted in ascending order.",
      stepExplanation: "Array completely sorted!",
      isComplete: true,
    }),
  );

  return steps;
}

export function generateUnsortedArray(size: number): number[] {
  return generateRandomArray(size);
}
