import { getAlgorithmT } from "../i18n/index";
import { generateRandomArray } from "../utils/randomArray";

export type PivotStrategy = "first" | "middle" | "last" | "random";

export interface QuickSortStep {
  array: number[];
  subArrayRange: [number, number];
  pivotIndex: number | null;
  leftIndex: number | null;
  rightIndex: number | null;
  comparingIdx: number | null;
  swapIndices: [number, number] | null;
  sortedIndices: number[];
  activeLine: number;
  statusTitle: string;
  statusDetail: string;
  stepExplanation: string;
  isComplete?: boolean;
}

interface StepContext {
  arr: number[];
  sortedIndices: Set<number>;
  steps: QuickSortStep[];
  pivotStrategy: PivotStrategy;
}

function pickPivotIndex(
  strategy: PivotStrategy,
  low: number,
  high: number,
): number {
  switch (strategy) {
    case "first":
      return low;
    case "last":
      return high;
    case "middle":
      return Math.floor((low + high) / 2);
    case "random":
      return Math.floor(Math.random() * (high - low + 1)) + low;
    default: {
      const _exhaustive: never = strategy;
      return _exhaustive;
    }
  }
}

function pivotChoiceCopy(
  strategy: PivotStrategy,
  pivotPick: number,
  low: number,
  high: number,
  pivotValue: number,
): Pick<QuickSortStep, "statusTitle" | "statusDetail" | "stepExplanation"> {
  const t = getAlgorithmT();
  const range = `[${low}..${high}]`;

  switch (strategy) {
    case "first":
      return {
        statusTitle: t("quickSort.pivot.first.statusTitle"),
        statusDetail: t("quickSort.pivot.first.statusDetail", {
          range,
          pivotPick,
          pivotValue,
        }),
        stepExplanation: t("quickSort.pivot.first.stepExplanation", { low }),
      };
    case "last":
      return {
        statusTitle: t("quickSort.pivot.last.statusTitle"),
        statusDetail: t("quickSort.pivot.last.statusDetail", {
          range,
          pivotPick,
          pivotValue,
        }),
        stepExplanation: t("quickSort.pivot.last.stepExplanation", { high }),
      };
    case "middle":
      return {
        statusTitle: t("quickSort.pivot.middle.statusTitle"),
        statusDetail: t("quickSort.pivot.middle.statusDetail", {
          range,
          pivotPick,
          pivotValue,
        }),
        stepExplanation: t("quickSort.pivot.middle.stepExplanation", {
          pivotPick,
          range,
        }),
      };
    case "random":
      return {
        statusTitle: t("quickSort.pivot.random.statusTitle"),
        statusDetail: t("quickSort.pivot.random.statusDetail", {
          range,
          pivotPick,
          pivotValue,
        }),
        stepExplanation: t("quickSort.pivot.random.stepExplanation", {
          range,
          pivotPick,
        }),
      };
    default: {
      const _exhaustive: never = strategy;
      return _exhaustive;
    }
  }
}

function initStepCopy(strategy: PivotStrategy, size: number): string {
  const t = getAlgorithmT();

  switch (strategy) {
    case "first":
      return t("quickSort.init.first", { size });
    case "last":
      return t("quickSort.init.last", { size });
    case "middle":
      return t("quickSort.init.middle", { size });
    case "random":
      return t("quickSort.init.random", { size });
    default: {
      const _exhaustive: never = strategy;
      return _exhaustive;
    }
  }
}

function createStep(partial: QuickSortStep): QuickSortStep {
  return {
    ...partial,
    sortedIndices: [...partial.sortedIndices],
  };
}

function pushStep(
  ctx: StepContext,
  partial: Omit<QuickSortStep, "array" | "sortedIndices">,
): void {
  ctx.steps.push(
    createStep({
      ...partial,
      array: [...ctx.arr],
      sortedIndices: [...ctx.sortedIndices],
    }),
  );
}

function swapElements(
  ctx: StepContext,
  i: number,
  j: number,
  low: number,
  high: number,
  pivotIndex: number | null,
  leftIndex: number | null,
  rightIndex: number | null,
  activeLine: number,
  statusTitle: string,
  statusDetail: string,
  stepExplanation: string,
): void {
  [ctx.arr[i], ctx.arr[j]] = [ctx.arr[j], ctx.arr[i]];

  pushStep(ctx, {
    subArrayRange: [low, high],
    pivotIndex,
    leftIndex,
    rightIndex,
    comparingIdx: null,
    swapIndices: [i, j],
    activeLine,
    statusTitle,
    statusDetail,
    stepExplanation,
  });
}

function partition(
  ctx: StepContext,
  low: number,
  high: number,
): number {
  const t = getAlgorithmT();
  const pivotPick = pickPivotIndex(ctx.pivotStrategy, low, high);
  const pivotChoice = pivotChoiceCopy(
    ctx.pivotStrategy,
    pivotPick,
    low,
    high,
    ctx.arr[pivotPick]!,
  );

  pushStep(ctx, {
    subArrayRange: [low, high],
    pivotIndex: pivotPick,
    leftIndex: null,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 12,
    ...pivotChoice,
  });

  if (pivotPick !== high) {
    swapElements(
      ctx,
      pivotPick,
      high,
      low,
      high,
      high,
      null,
      null,
      13,
      t("quickSort.movePivotToEnd.statusTitle"),
      t("quickSort.movePivotToEnd.statusDetail", { pivotPick, high }),
      t("quickSort.movePivotToEnd.stepExplanation", { high }),
    );
  }

  const pivotValue = ctx.arr[high];

  pushStep(ctx, {
    subArrayRange: [low, high],
    pivotIndex: high,
    leftIndex: low - 1,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 14,
    statusTitle: t("quickSort.initPartition.statusTitle"),
    statusDetail: t("quickSort.initPartition.statusDetail", {
      pivotValue,
      high,
      i: low - 1,
    }),
    stepExplanation: t("quickSort.initPartition.stepExplanation", {
      pivotValue,
      i: low - 1,
    }),
  });

  let i = low - 1;

  for (let j = low; j < high; j += 1) {
    const currentValue = ctx.arr[j];
    const belongsLeft = currentValue <= pivotValue;

    pushStep(ctx, {
      subArrayRange: [low, high],
      pivotIndex: high,
      leftIndex: i,
      rightIndex: j,
      comparingIdx: j,
      swapIndices: null,
      activeLine: 17,
      statusTitle: t("quickSort.compare.statusTitle", { j }),
      statusDetail: belongsLeft
        ? t("quickSort.compare.statusDetail.left", {
            currentValue,
            pivotValue,
          })
        : t("quickSort.compare.statusDetail.right", {
            currentValue,
            pivotValue,
          }),
      stepExplanation: belongsLeft
        ? t("quickSort.compare.stepExplanation.left", {
            j,
            currentValue,
            pivotValue,
          })
        : t("quickSort.compare.stepExplanation.right", {
            j,
            currentValue,
            pivotValue,
          }),
    });

    if (belongsLeft) {
      i += 1;

      if (i !== j) {
        swapElements(
          ctx,
          i,
          j,
          low,
          high,
          high,
          i,
          j,
          19,
          t("quickSort.swapIntoLeft.statusTitle"),
          t("quickSort.swapIntoLeft.statusDetail", { i, j }),
          t("quickSort.swapIntoLeft.stepExplanation", { i, j }),
        );
      } else {
        pushStep(ctx, {
          subArrayRange: [low, high],
          pivotIndex: high,
          leftIndex: i,
          rightIndex: j,
          comparingIdx: j,
          swapIndices: null,
          activeLine: 18,
          statusTitle: t("quickSort.advanceBoundary.statusTitle"),
          statusDetail: t("quickSort.advanceBoundary.statusDetail", { i, j }),
          stepExplanation: t("quickSort.advanceBoundary.stepExplanation", { i }),
        });
      }
    }
  }

  const pivotFinalIndex = i + 1;

  swapElements(
    ctx,
    pivotFinalIndex,
    high,
    low,
    high,
    pivotFinalIndex,
    i,
    high,
    22,
    t("quickSort.placePivot.statusTitle"),
    t("quickSort.placePivot.statusDetail", { high, pivotIndex: pivotFinalIndex }),
    t("quickSort.placePivot.stepExplanation", {
      pivotIndex: pivotFinalIndex,
      high,
    }),
  );

  ctx.sortedIndices.add(pivotFinalIndex);

  pushStep(ctx, {
    subArrayRange: [low, high],
    pivotIndex: pivotFinalIndex,
    leftIndex: i,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 23,
    statusTitle: t("quickSort.partitionComplete.statusTitle"),
    statusDetail: t("quickSort.partitionComplete.statusDetail", {
      pivotValue: ctx.arr[pivotFinalIndex],
      pivotIndex: pivotFinalIndex,
      low,
      leftHigh: pivotFinalIndex - 1,
      rightLow: pivotFinalIndex + 1,
      high,
    }),
    stepExplanation: t("quickSort.partitionComplete.stepExplanation", {
      pivotIndex: pivotFinalIndex,
    }),
  });

  return pivotFinalIndex;
}

function quickSortRange(
  ctx: StepContext,
  low: number,
  high: number,
): void {
  const t = getAlgorithmT();

  if (low >= high) {
    if (low === high && low >= 0 && low < ctx.arr.length) {
      ctx.sortedIndices.add(low);
      pushStep(ctx, {
        subArrayRange: [low, high],
        pivotIndex: low,
        leftIndex: null,
        rightIndex: null,
        comparingIdx: null,
        swapIndices: null,
        activeLine: 2,
        statusTitle: t("quickSort.baseCase.statusTitle"),
        statusDetail: t("quickSort.baseCase.statusDetail", { low }),
        stepExplanation: t("quickSort.baseCase.stepExplanation"),
      });
    }
    return;
  }

  pushStep(ctx, {
    subArrayRange: [low, high],
    pivotIndex: null,
    leftIndex: null,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 2,
    statusTitle: t("quickSort.recursiveCall.statusTitle"),
    statusDetail: t("quickSort.recursiveCall.statusDetail", {
      low,
      high,
      count: high - low + 1,
    }),
    stepExplanation: t("quickSort.recursiveCall.stepExplanation", { low, high }),
  });

  const pivotIndex = partition(ctx, low, high);
  const leftHigh = pivotIndex - 1;
  const rightLow = pivotIndex + 1;

  if (low <= leftHigh) {
    pushStep(ctx, {
      subArrayRange: [low, leftHigh],
      pivotIndex: null,
      leftIndex: null,
      rightIndex: null,
      comparingIdx: null,
      swapIndices: null,
      activeLine: 6,
      statusTitle: t("quickSort.recurseLeft.statusTitle"),
      statusDetail: t("quickSort.recurseLeft.statusDetail", {
        low,
        high: leftHigh,
      }),
      stepExplanation: t("quickSort.recurseLeft.stepExplanation", {
        low,
        high: leftHigh,
      }),
    });

    quickSortRange(ctx, low, leftHigh);
  }

  if (rightLow <= high) {
    pushStep(ctx, {
      subArrayRange: [rightLow, high],
      pivotIndex: null,
      leftIndex: null,
      rightIndex: null,
      comparingIdx: null,
      swapIndices: null,
      activeLine: 7,
      statusTitle: t("quickSort.recurseRight.statusTitle"),
      statusDetail: t("quickSort.recurseRight.statusDetail", {
        low: rightLow,
        high,
      }),
      stepExplanation: t("quickSort.recurseRight.stepExplanation", {
        low: rightLow,
        high,
      }),
    });

    quickSortRange(ctx, rightLow, high);
  }
}

export function generateQuickSortSteps(
  input: number[],
  pivotStrategy: PivotStrategy = "random",
): QuickSortStep[] {
  const t = getAlgorithmT();
  const arr = [...input];
  const n = arr.length;
  const ctx: StepContext = {
    arr,
    sortedIndices: new Set<number>(),
    steps: [],
    pivotStrategy,
  };

  if (n === 0) {
    return ctx.steps;
  }

  if (n === 1) {
    ctx.sortedIndices.add(0);
    pushStep(ctx, {
      subArrayRange: [0, 0],
      pivotIndex: 0,
      leftIndex: null,
      rightIndex: null,
      comparingIdx: null,
      swapIndices: null,
      activeLine: 2,
      statusTitle: t("quickSort.singleElement.statusTitle"),
      statusDetail: t("quickSort.singleElement.statusDetail"),
      stepExplanation: t("quickSort.singleElement.stepExplanation"),
      isComplete: true,
    });
    return ctx.steps;
  }

  pushStep(ctx, {
    subArrayRange: [0, n - 1],
    pivotIndex: null,
    leftIndex: null,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 1,
    statusTitle: t("quickSort.init.statusTitle"),
    statusDetail: t("quickSort.init.statusDetail", { n, strategy: pivotStrategy }),
    stepExplanation: initStepCopy(pivotStrategy, n),
  });

  quickSortRange(ctx, 0, n - 1);

  for (let index = 0; index < n; index += 1) {
    ctx.sortedIndices.add(index);
  }

  pushStep(ctx, {
    subArrayRange: [0, n - 1],
    pivotIndex: null,
    leftIndex: null,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 9,
    statusTitle: t("quickSort.complete.statusTitle"),
    statusDetail: t("quickSort.complete.statusDetail"),
    stepExplanation: t("quickSort.complete.stepExplanation"),
    isComplete: true,
  });

  return ctx.steps;
}

export function generateUnsortedArray(size: number): number[] {
  return generateRandomArray(size);
}
