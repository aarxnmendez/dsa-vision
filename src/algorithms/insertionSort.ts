import { getAlgorithmT } from "../i18n/index";
import { generateRandomArray } from "../utils/randomArray";

export type InsertionSortPhase =
  | "init"
  | "select-key"
  | "compare"
  | "extract-key"
  | "shift"
  | "insert"
  | "pass-complete"
  | "complete";

export interface InsertionSortStep {
  phase: InsertionSortPhase;
  /** Visual array at this instant; `null` = empty slot (hole). */
  array: (number | null)[];
  sortedBoundary: number;
  keyValue: number;
  keyIndex: number | null;
  /** Hole index while key is extracted; follows shifts until insert. */
  holeIndex: number | null;
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

function asFilledArray(values: (number | null)[]): number[] {
  return values.map((value) => value ?? 0);
}

export function generateInsertionSortSteps(input: number[]): InsertionSortStep[] {
  const t = getAlgorithmT();
  const arr = asFilledArray(input);
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
        phase: "complete",
        array: [...arr],
        sortedBoundary: 1,
        keyValue: arr[0],
        keyIndex: null,
        holeIndex: null,
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
      phase: "init",
      array: [...arr],
      sortedBoundary: 1,
      keyValue: arr[0],
      keyIndex: null,
      holeIndex: null,
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
        phase: "select-key",
        array: [...arr],
        sortedBoundary: i,
        keyValue: key,
        keyIndex: i,
        holeIndex: null,
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

    if (i > 0 && arr[i - 1] <= key) {
      steps.push(
        createStep({
          phase: "compare",
          array: [...arr],
          sortedBoundary: i,
          keyValue: key,
          keyIndex: i,
          holeIndex: null,
          comparingIdx: i - 1,
          shiftIndices: null,
          insertIndex: i,
          comparisons: comparisons + 1,
          shifts,
          activeLine: 6,
          statusTitle: t("insertionSort.comparing.statusTitle", {
            compareValue: arr[i - 1],
            key,
          }),
          statusDetail: t("insertionSort.comparing.statusDetail.stop", {
            compareValue: arr[i - 1],
            key,
            j: i - 1,
            insertIndex: i,
          }),
          stepExplanation: t("insertionSort.comparing.stepExplanation.stop", {
            key,
            compareValue: arr[i - 1],
            j: i - 1,
            insertIndex: i,
          }),
        }),
      );
      comparisons += 1;

      steps.push(
        createStep({
          phase: "insert",
          array: [...arr],
          sortedBoundary: i + 1,
          keyValue: key,
          keyIndex: null,
          holeIndex: null,
          comparingIdx: null,
          shiftIndices: null,
          insertIndex: i,
          comparisons,
          shifts,
          activeLine: 9,
          statusTitle: t("insertionSort.insertingInPlace.statusTitle", {
            key,
            i,
          }),
          statusDetail: t("insertionSort.insertingInPlace.statusDetail", {
            key,
            i,
          }),
          stepExplanation: t("insertionSort.insertingInPlace.stepExplanation", {
            key,
            i,
          }),
        }),
      );

      steps.push(
        createStep({
          phase: "pass-complete",
          array: [...arr],
          sortedBoundary: i + 1,
          keyValue: key,
          keyIndex: null,
          holeIndex: null,
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
      continue;
    }

    const work: (number | null)[] = [...arr];
    work[i] = null;

    steps.push(
      createStep({
        phase: "extract-key",
        array: [...work],
        sortedBoundary: i,
        keyValue: key,
        keyIndex: i,
        holeIndex: i,
        comparingIdx: null,
        shiftIndices: null,
        insertIndex: null,
        comparisons,
        shifts,
        activeLine: 4,
        statusTitle: t("insertionSort.extractKey.statusTitle", { key }),
        statusDetail: t("insertionSort.extractKey.statusDetail", {
          key,
          i,
        }),
        stepExplanation: t("insertionSort.extractKey.stepExplanation", {
          key,
          i,
        }),
      }),
    );

    let j = i - 1;

    while (j >= 0) {
      const compareValue = work[j]!;
      comparisons += 1;
      const shouldShift = compareValue > key;

      steps.push(
        createStep({
          phase: "compare",
          array: [...work],
          sortedBoundary: i,
          keyValue: key,
          keyIndex: null,
          holeIndex: j + 1,
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
                j,
              })
            : t("insertionSort.comparing.statusDetail.stop", {
                compareValue,
                key,
                j,
                insertIndex: j + 1,
              }),
          stepExplanation: shouldShift
            ? t("insertionSort.comparing.stepExplanation.shift", {
                key,
                compareValue,
                j,
                jPlusOne: j + 1,
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
      work[j + 1] = compareValue;

      steps.push(
        createStep({
          phase: "shift",
          array: [...work],
          sortedBoundary: i,
          keyValue: key,
          keyIndex: null,
          holeIndex: j,
          comparingIdx: null,
          shiftIndices: [j, j + 1],
          insertIndex: j + 1,
          comparisons,
          shifts,
          activeLine: 7,
          statusTitle: t("insertionSort.shifting.statusTitle", {
            compareValue,
          }),
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

      j -= 1;
    }

    const targetIndex = j + 1;
    work[targetIndex] = key;

    for (let index = 0; index < n; index += 1) {
      arr[index] = work[index]!;
    }

    steps.push(
      createStep({
        phase: "insert",
        array: [...work],
        sortedBoundary: i + 1,
        keyValue: key,
        keyIndex: null,
        holeIndex: null,
        comparingIdx: null,
        shiftIndices: null,
        insertIndex: targetIndex,
        comparisons,
        shifts,
        activeLine: 9,
        statusTitle: t("insertionSort.inserting.statusTitle", {
          key,
          targetIndex,
        }),
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

    steps.push(
      createStep({
        phase: "pass-complete",
        array: [...work],
        sortedBoundary: i + 1,
        keyValue: key,
        keyIndex: null,
        holeIndex: null,
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
      phase: "complete",
      array: [...arr],
      sortedBoundary: n,
      keyValue: arr[n - 1],
      keyIndex: null,
      holeIndex: null,
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
