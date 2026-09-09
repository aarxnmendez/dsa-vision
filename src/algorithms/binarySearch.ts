import { getAlgorithmT } from "../i18n/index";

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
  const t = getAlgorithmT();

  return createStep({
    phase: "not-found",
    low,
    high,
    mid: null,
    showMid: false,
    compareMid: false,
    target,
    arrayValue: -1,
    statusTitle: t("binarySearch.notFound.statusTitle", { target }),
    statusDetail: t("binarySearch.notFound.statusDetail"),
    stepExplanation: t("binarySearch.notFound.stepExplanation"),
    codeLine: 17,
  });
}

export function binarySearch(
  array: number[],
  target: number,
): BinarySearchStep[] {
  const t = getAlgorithmT();

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
      statusTitle: t("binarySearch.initial.statusTitle"),
      statusDetail: t("binarySearch.initial.statusDetail", { low, high }),
      stepExplanation: t("binarySearch.initial.stepExplanation"),
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
        statusTitle: t("binarySearch.calculateMid.statusTitle"),
        statusDetail: t("binarySearch.calculateMid.statusDetail", {
          low,
          high,
          mid,
        }),
        stepExplanation: t("binarySearch.calculateMid.stepExplanation"),
        stepFormula: t("binarySearch.calculateMid.stepFormula", {
          low,
          high,
          mid,
        }),
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
        statusTitle: t("binarySearch.compare.statusTitle", {
          arrayValue,
          target,
        }),
        statusDetail:
          arrayValue === target
            ? t("binarySearch.compare.statusDetail.equal", {
                arrayValue,
                target,
              })
            : arrayValue < target
              ? t("binarySearch.compare.statusDetail.less", {
                  arrayValue,
                  target,
                })
              : t("binarySearch.compare.statusDetail.greater", {
                  arrayValue,
                  target,
                }),
        stepExplanation: t("binarySearch.compare.stepExplanation"),
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
          statusTitle: t("binarySearch.found.statusTitle", {
            arrayValue,
            target,
          }),
          statusDetail: t("binarySearch.found.statusDetail", { target, mid }),
          pointerMovement: t("binarySearch.found.pointerMovement", { mid }),
          stepExplanation: t("binarySearch.found.stepExplanation"),
          stepFormula: t("binarySearch.found.stepFormula", { mid }),
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
          statusTitle: t("binarySearch.moveLowPointer.statusTitle"),
          statusDetail: t("binarySearch.moveLowPointer.statusDetail", {
            low,
            high,
          }),
          pointerMovement: t("binarySearch.moveLowPointer.pointerMovement", {
            previousLow,
            low,
          }),
          stepExplanation: t("binarySearch.moveLowPointer.stepExplanation"),
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
          statusTitle: t("binarySearch.moveHighPointer.statusTitle"),
          statusDetail: t("binarySearch.moveHighPointer.statusDetail", {
            low,
            high,
          }),
          pointerMovement: t("binarySearch.moveHighPointer.pointerMovement", {
            previousHigh,
            high,
          }),
          stepExplanation: t("binarySearch.moveHighPointer.stepExplanation"),
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
