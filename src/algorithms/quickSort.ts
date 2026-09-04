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
  const rangeLabel = `[${low}..${high}]`;

  switch (strategy) {
    case "first":
      return {
        statusTitle: "Choose first pivot",
        statusDetail: `Sub-array ${rangeLabel}. Index ${pivotPick} (first element) selects pivot ${pivotValue}.`,
        stepExplanation: `First-element pivot always uses index ${low}. On already sorted data this creates maximally unbalanced partitions and O(n²) recursion depth.`,
      };
    case "last":
      return {
        statusTitle: "Choose last pivot",
        statusDetail: `Sub-array ${rangeLabel}. Index ${pivotPick} (last element) selects pivot ${pivotValue}.`,
        stepExplanation: `Last-element pivot always uses index ${high}. On reverse-sorted data this skews partitions and can degrade to O(n²).`,
      };
    case "middle":
      return {
        statusTitle: "Choose middle pivot",
        statusDetail: `Sub-array ${rangeLabel}. Middle index ${pivotPick} selects pivot ${pivotValue}.`,
        stepExplanation: `Middle pivot at index ${pivotPick} tends to split ${rangeLabel} evenly on sorted or uniform input, keeping average depth near O(log n).`,
      };
    case "random":
      return {
        statusTitle: "Choose random pivot",
        statusDetail: `Sub-array ${rangeLabel}. Random index ${pivotPick} selects pivot ${pivotValue}.`,
        stepExplanation: `Random pivot in ${rangeLabel} (here: index ${pivotPick}) makes highly unbalanced splits unlikely on average, preserving expected O(n log n) time.`,
      };
    default: {
      const _exhaustive: never = strategy;
      return _exhaustive;
    }
  }
}

function initStepCopy(strategy: PivotStrategy, size: number): string {
  switch (strategy) {
    case "first":
      return `Initialize quicksort with first-element pivots on a ${size}-element array. Watch recursion deepen on sorted input.`;
    case "last":
      return `Initialize quicksort with last-element pivots on a ${size}-element array. Partitions may skew on reverse-sorted input.`;
    case "middle":
      return `Initialize quicksort with middle pivots on a ${size}-element array. Expect relatively balanced partitions.`;
    case "random":
      return `Initialize randomized quicksort on a ${size}-element array. Each partition picks a random pivot within the active sub-array.`;
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

  [ctx.arr[i], ctx.arr[j]] = [ctx.arr[j], ctx.arr[i]];
}

function partition(
  ctx: StepContext,
  low: number,
  high: number,
): number {
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
      "Move pivot to end",
      `Swap index ${pivotPick} with ${high} so the pivot sits at the partition boundary.`,
      `Move the pivot candidate to index ${high} before scanning the sub-array.`,
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
    statusTitle: "Initialize partition",
    statusDetail: `Pivot = ${pivotValue} at index ${high}. Set i = ${low - 1}.`,
    stepExplanation: `Pivot value is ${pivotValue}. Initialize i = ${low - 1} to mark the end of the "less than or equal" region.`,
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
      statusTitle: `Compare index ${j}`,
      statusDetail: belongsLeft
        ? `${currentValue} <= ${pivotValue}. Element belongs on the left side of the pivot.`
        : `${currentValue} > ${pivotValue}. Element stays on the right side of the pivot.`,
      stepExplanation: belongsLeft
        ? `Scan index j = ${j} (value ${currentValue}). It is less than or equal to pivot ${pivotValue}, so it belongs in the left partition.`
        : `Scan index j = ${j} (value ${currentValue}). It is greater than pivot ${pivotValue}, so i does not advance.`,
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
          "Swap into left partition",
          `Increment i to ${i}, then swap index ${i} with ${j}.`,
          `Advance i to ${i} and swap arr[${i}] with arr[${j}] to grow the left partition.`,
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
          statusTitle: "Advance partition boundary",
          statusDetail: `Increment i to ${i}. Index ${j} is already in the left partition.`,
          stepExplanation: `i advances to ${i}. No swap needed because j already equals i.`,
        });
      }
    }
  }

  swapElements(
    ctx,
    i + 1,
    high,
    low,
    high,
    i + 1,
    i,
    high,
    22,
    "Place pivot",
    `Swap pivot at index ${high} with index ${i + 1}. Pivot locks into final position.`,
    `Swap arr[${i + 1}] with arr[${high}] so the pivot rests at its sorted index ${i + 1}.`,
  );

  const pivotFinalIndex = i + 1;
  ctx.sortedIndices.add(pivotFinalIndex);

  pushStep(ctx, {
    subArrayRange: [low, high],
    pivotIndex: pivotFinalIndex,
    leftIndex: i,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 23,
    statusTitle: "Partition complete",
    statusDetail: `Pivot ${ctx.arr[pivotFinalIndex]} is fixed at index ${pivotFinalIndex}. Recurse on [${low}..${pivotFinalIndex - 1}] and [${pivotFinalIndex + 1}..${high}].`,
    stepExplanation: `Partition complete. Index ${pivotFinalIndex} is in its final sorted position. Elements left of it are <= pivot; elements right are > pivot.`,
  });

  return pivotFinalIndex;
}

function quickSortRange(
  ctx: StepContext,
  low: number,
  high: number,
): void {
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
        statusTitle: "Base case",
        statusDetail: `Single element at index ${low} is already sorted.`,
        stepExplanation: `Recursive base case: a sub-array of one element requires no further partitioning.`,
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
    statusTitle: "Recursive call",
    statusDetail: `Sort sub-array [${low}..${high}] (${high - low + 1} elements).`,
    stepExplanation: `Divide: quicksort is called on sub-array indices ${low} through ${high}.`,
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
      statusTitle: "Recurse left",
      statusDetail: `Left partition [${low}..${leftHigh}] contains elements <= pivot.`,
      stepExplanation: `Conquer left: recursively sort indices ${low} to ${leftHigh}.`,
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
      statusTitle: "Recurse right",
      statusDetail: `Right partition [${rightLow}..${high}] contains elements > pivot.`,
      stepExplanation: `Conquer right: recursively sort indices ${rightLow} to ${high}.`,
    });

    quickSortRange(ctx, rightLow, high);
  }
}

export function generateQuickSortSteps(
  input: number[],
  pivotStrategy: PivotStrategy = "random",
): QuickSortStep[] {
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
      statusTitle: "Sorting complete",
      statusDetail: "Single-element array is already sorted.",
      stepExplanation: "Base case: arrays with one element are already sorted.",
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
    statusTitle: "Initializing",
    statusDetail: `${n}-element array. Quicksort will partition recursively using the ${pivotStrategy} pivot strategy.`,
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
    statusTitle: "Sorting complete",
    statusDetail: "The array is fully sorted in ascending order.",
    stepExplanation: "All partitions resolved. The array is completely sorted.",
    isComplete: true,
  });

  return ctx.steps;
}

export function generateUnsortedArray(size: number): number[] {
  return generateRandomArray(size);
}
