import { getAlgorithmT } from "../i18n/index";
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
  const t = getAlgorithmT();
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
        statusTitle: t("insertionSort.complete.statusTitle"),
        statusDetail: t("insertionSort.complete.statusDetail"),
        stepExplanation: t("insertionSort.complete.stepExplanation"),
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
      statusTitle: t("insertionSort.init.statusTitle"),
      statusDetail: t("insertionSort.init.statusDetail", { n }),
      stepExplanation: t("insertionSort.init.stepExplanation"),
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
        statusTitle: t("insertionSort.selectKey.statusTitle", { key }),
        statusDetail: t("insertionSort.selectKey.statusDetail", {
          key,
          i,
          lastSorted: i - 1,
        }),
        stepExplanation: t("insertionSort.selectKey.stepExplanation", { i, key }),
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
          statusTitle: t("insertionSort.comparing.statusTitle", {
            compareValue,
            key,
          }),
          statusDetail: shouldShift
            ? t("insertionSort.comparing.statusDetail.shift", {
                compareValue,
                key,
              })
            : t("insertionSort.comparing.statusDetail.stop", {
                compareValue,
                key,
                insertIndex: j + 1,
              }),
          stepExplanation: shouldShift
            ? t("insertionSort.comparing.stepExplanation.shift", {
                key,
                compareValue,
                j,
              })
            : t("insertionSort.comparing.stepExplanation.stop", {
                key,
                compareValue,
                j,
                insertIndex: j + 1,
              }),
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
          statusTitle: t("insertionSort.shifting.statusTitle", { compareValue }),
          statusDetail: t("insertionSort.shifting.statusDetail", {
            compareValue,
            j,
            jPlusOne: j + 1,
          }),
          stepExplanation: t("insertionSort.shifting.stepExplanation", {
            compareValue,
            j,
            jPlusOne: j + 1,
            key,
          }),
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
        statusTitle: t("insertionSort.inserting.statusTitle", { key }),
        statusDetail: t("insertionSort.inserting.statusDetail", {
          key,
          targetIndex,
        }),
        stepExplanation: t("insertionSort.inserting.stepExplanation", {
          key,
          targetIndex,
        }),
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
        statusTitle: t("insertionSort.passComplete.statusTitle", { i }),
        statusDetail: t("insertionSort.passComplete.statusDetail", {
          i,
          nextIndex: i + 1,
        }),
        stepExplanation: t("insertionSort.passComplete.stepExplanation", { i }),
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
      statusTitle: t("insertionSort.complete.statusTitle"),
      statusDetail: t("insertionSort.complete.statusDetail"),
      stepExplanation: t("insertionSort.complete.stepExplanation"),
      isComplete: true,
    }),
  );

  return steps;
}

export function generateUnsortedArray(size: number): number[] {
  return generateRandomArray(size);
}
