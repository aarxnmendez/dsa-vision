import { getAlgorithmT } from "../i18n/index";
import { generateRandomArray } from "../utils/randomArray";

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
  const t = getAlgorithmT();

  if (isLess) {
    return t("selectionSort.comparing.statusDetail.less", {
      current,
      minimum,
      comparingIdx,
    });
  }

  if (current > minimum) {
    return t("selectionSort.comparing.statusDetail.greater", {
      current,
      minimum,
      minIdx,
    });
  }

  return t("selectionSort.comparing.statusDetail.equal", {
    current,
    minimum,
    minIdx,
  });
}

export function generateSelectionSortSteps(input: number[]): SelectionSortStep[] {
  const t = getAlgorithmT();
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
        statusTitle: t("selectionSort.complete.statusTitle"),
        statusDetail: t("selectionSort.complete.statusDetail"),
        stepExplanation: t("selectionSort.complete.stepExplanation"),
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
      statusTitle: t("selectionSort.init.statusTitle"),
      statusDetail: t("selectionSort.init.statusDetail", { n }),
      stepExplanation: t("selectionSort.init.stepExplanation"),
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
        statusTitle: t("selectionSort.startPass.statusTitle", { pass: i + 1 }),
        statusDetail: t("selectionSort.startPass.statusDetail", {
          value: arr[i],
          index: i,
        }),
        stepExplanation: t("selectionSort.startPass.stepExplanation", {
          pass: i + 1,
          index: i,
          value: arr[i],
        }),
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
          statusTitle: t("selectionSort.comparing.statusTitle", {
            current: currentValue,
            minimum: minimumValue,
          }),
          statusDetail: compareStatusDetail(
            currentValue,
            minimumValue,
            minIdx,
            j,
            isLess,
          ),
          stepExplanation: isLess
            ? t("selectionSort.comparing.stepExplanation.less", {
                j,
                current: currentValue,
                minimum: minimumValue,
              })
            : t("selectionSort.comparing.stepExplanation.notLess", {
                j,
                current: currentValue,
                minimum: minimumValue,
                minIdx,
              }),
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
            statusTitle: t("selectionSort.newMinimum.statusTitle"),
            statusDetail: t("selectionSort.newMinimum.statusDetail", {
              current: currentValue,
              previousMinimum,
              j,
            }),
            stepExplanation: t("selectionSort.newMinimum.stepExplanation", {
              j,
              current: currentValue,
            }),
          }),
        );
      }
    }

    if (minIdx !== i) {
      swaps += 1;
      const valueAtOuterIndex = arr[i];
      const minimumValue = arr[minIdx];

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

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
          statusTitle: t("selectionSort.placingMinimum.statusTitle"),
          statusDetail: t("selectionSort.placingMinimum.statusDetail", {
            minimumValue,
            valueAtOuterIndex,
            i,
          }),
          stepExplanation: t("selectionSort.placingMinimum.stepExplanation", {
            i,
            valueAtOuterIndex,
            minIdx,
            minimumValue,
          }),
        }),
      );
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
        statusTitle: t("selectionSort.passComplete.statusTitle", { pass: i + 1 }),
        statusDetail: passWasSwap
          ? t("selectionSort.passComplete.statusDetail.swap", {
              i,
              sortedValue,
            })
          : t("selectionSort.passComplete.statusDetail.noSwap", {
              sortedValue,
              i,
            }),
        stepExplanation: passWasSwap
          ? t("selectionSort.passComplete.stepExplanation.swap", {
              i,
              count: i + 1,
            })
          : t("selectionSort.passComplete.stepExplanation.noSwap", { i }),
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
      statusTitle: t("selectionSort.complete.statusTitle"),
      statusDetail: t("selectionSort.complete.statusDetail"),
      stepExplanation: t("selectionSort.complete.stepExplanation"),
      isComplete: true,
    }),
  );

  return steps;
}

export function generateUnsortedArray(size: number): number[] {
  return generateRandomArray(size);
}
