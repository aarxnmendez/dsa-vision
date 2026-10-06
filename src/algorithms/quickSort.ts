import { getAlgorithmT } from "../i18n/index";
import type { SortBarHighlight } from "../types/visualizer";
import { generateRandomArray } from "../utils/randomArray";

export type PivotStrategy = "first" | "middle" | "last" | "random";

export interface QuickSortTreeNode {
  id: string;
  low: number;
  high: number;
  values: number[];
  cellHighlights: SortBarHighlight[];
  nodeHighlight: "default" | "active" | "done";
}

export interface QuickSortTreeLink {
  fromId: string;
  toId: string;
}

export interface QuickSortStep {
  array: number[];
  nodes: QuickSortTreeNode[];
  links: QuickSortTreeLink[];
  activeNodeId: string | null;
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
  nodes: Map<string, QuickSortTreeNode>;
  links: QuickSortTreeLink[];
  steps: QuickSortStep[];
  pivotStrategy: PivotStrategy;
}

function rangeId(low: number, high: number): string {
  return `${low}-${high}`;
}

function defaultHighlights(length: number): SortBarHighlight[] {
  return Array.from({ length }, () => "default");
}

function cloneNodes(nodes: Map<string, QuickSortTreeNode>): QuickSortTreeNode[] {
  return [...nodes.values()].map((node) => ({
    ...node,
    values: [...node.values],
    cellHighlights: [...node.cellHighlights],
  }));
}

function cloneLinks(links: QuickSortTreeLink[]): QuickSortTreeLink[] {
  return links.map((link) => ({ ...link }));
}

function ensureNode(
  ctx: StepContext,
  low: number,
  high: number,
): QuickSortTreeNode {
  const id = rangeId(low, high);
  let node = ctx.nodes.get(id);

  if (!node) {
    node = {
      id,
      low,
      high,
      values: ctx.arr.slice(low, high + 1),
      cellHighlights: defaultHighlights(high - low + 1),
      nodeHighlight: "default",
    };
    ctx.nodes.set(id, node);
  } else {
    refreshNodeValuesFromArray(ctx, node);
  }

  return node;
}

function highlightRank(highlight: SortBarHighlight): number {
  switch (highlight) {
    case "sorted":
      return 4;
    case "swapping":
      return 3;
    case "comparing":
      return 2;
    case "pivot":
      return 1;
    default:
      return 0;
  }
}

function pickStrongerHighlight(
  current: SortBarHighlight,
  next: SortBarHighlight,
): SortBarHighlight {
  return highlightRank(next) >= highlightRank(current) ? next : current;
}

function refreshNodeValuesFromArray(ctx: StepContext, node: QuickSortTreeNode): void {
  node.values = ctx.arr.slice(node.low, node.high + 1);
  if (node.cellHighlights.length !== node.values.length) {
    node.cellHighlights = defaultHighlights(node.values.length);
  }
}

function buildGlobalCellHighlights(
  ctx: StepContext,
  partial: Pick<
    QuickSortStep,
    "pivotIndex" | "comparingIdx" | "swapIndices" | "subArrayRange"
  >,
): Map<number, SortBarHighlight> {
  const highlights = new Map<number, SortBarHighlight>();
  const [rangeLow, rangeHigh] = partial.subArrayRange;

  const applyEphemeral = (globalIndex: number, highlight: SortBarHighlight) => {
    if (globalIndex < rangeLow || globalIndex > rangeHigh) {
      return;
    }

    if (ctx.sortedIndices.has(globalIndex) && highlight !== "sorted") {
      return;
    }

    highlights.set(
      globalIndex,
      pickStrongerHighlight(highlights.get(globalIndex) ?? "default", highlight),
    );
  };

  for (const globalIndex of ctx.sortedIndices) {
    highlights.set(globalIndex, "sorted");
  }

  if (partial.swapIndices) {
    applyEphemeral(partial.swapIndices[0], "swapping");
    applyEphemeral(partial.swapIndices[1], "swapping");
  }

  if (partial.comparingIdx !== null) {
    applyEphemeral(partial.comparingIdx, "comparing");
  }

  if (partial.pivotIndex !== null) {
    applyEphemeral(partial.pivotIndex, "pivot");
  }

  return highlights;
}

function syncTreeHighlights(
  ctx: StepContext,
  activeNodeId: string | null,
  partial: Pick<
    QuickSortStep,
    "pivotIndex" | "comparingIdx" | "swapIndices" | "subArrayRange"
  >,
): void {
  const globalHighlights = buildGlobalCellHighlights(ctx, partial);

  for (const node of ctx.nodes.values()) {
    refreshNodeValuesFromArray(ctx, node);

    node.cellHighlights = node.values.map((_, local) => {
      const global = node.low + local;
      return globalHighlights.get(global) ?? "default";
    });

    if (activeNodeId && node.id === activeNodeId) {
      node.nodeHighlight = "active";
    } else if (node.nodeHighlight !== "done") {
      node.nodeHighlight = "default";
    }
  }

  if (!activeNodeId) {
    return;
  }

  const activeNode = ctx.nodes.get(activeNodeId);

  if (!activeNode) {
    return;
  }

  for (const node of ctx.nodes.values()) {
    if (
      node.id === activeNode.id ||
      node.low > activeNode.low ||
      node.high < activeNode.high
    ) {
      continue;
    }

    for (let local = 0; local < activeNode.cellHighlights.length; local += 1) {
      const global = activeNode.low + local;
      const activeHighlight = activeNode.cellHighlights[local];

      if (
        activeHighlight !== "pivot" &&
        activeHighlight !== "comparing" &&
        activeHighlight !== "sorted"
      ) {
        continue;
      }

      const ancestorLocal = global - node.low;
      if (ancestorLocal < 0 || ancestorLocal >= node.cellHighlights.length) {
        continue;
      }

      node.cellHighlights[ancestorLocal] = pickStrongerHighlight(
        node.cellHighlights[ancestorLocal] ?? "default",
        activeHighlight,
      );
    }
  }
}

function spawnPartitionChildren(
  ctx: StepContext,
  low: number,
  high: number,
  pivotIndex: number,
): void {
  const parentId = rangeId(low, high);
  const parent = ctx.nodes.get(parentId);
  if (parent) {
    parent.nodeHighlight = "done";
  }

  const leftHigh = pivotIndex - 1;
  const rightLow = pivotIndex + 1;

  if (low <= leftHigh) {
    const leftId = rangeId(low, leftHigh);
    ensureNode(ctx, low, leftHigh);
    if (!ctx.links.some((link) => link.fromId === parentId && link.toId === leftId)) {
      ctx.links.push({ fromId: parentId, toId: leftId });
    }
  }

  if (rightLow <= high) {
    const rightId = rangeId(rightLow, high);
    ensureNode(ctx, rightLow, high);
    if (!ctx.links.some((link) => link.fromId === parentId && link.toId === rightId)) {
      ctx.links.push({ fromId: parentId, toId: rightId });
    }
  }
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

function pushStep(
  ctx: StepContext,
  partial: Omit<
    QuickSortStep,
    "array" | "sortedIndices" | "nodes" | "links" | "activeNodeId"
  >,
  activeNodeId: string | null = rangeId(
    partial.subArrayRange[0],
    partial.subArrayRange[1],
  ),
): void {
  syncTreeHighlights(ctx, activeNodeId, partial);

  ctx.steps.push({
    ...partial,
    array: [...ctx.arr],
    sortedIndices: [...ctx.sortedIndices],
    nodes: cloneNodes(ctx.nodes),
    links: cloneLinks(ctx.links),
    activeNodeId,
  });
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
  const nodeId = rangeId(low, high);
  ensureNode(ctx, low, high);

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
    activeLine: 10,
    ...pivotChoice,
  }, nodeId);

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
      11,
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
    activeLine: 13,
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
  }, nodeId);

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
      activeLine: 15,
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
    }, nodeId);

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
          17,
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
          activeLine: 16,
          statusTitle: t("quickSort.advanceBoundary.statusTitle"),
          statusDetail: t("quickSort.advanceBoundary.statusDetail", { i, j }),
          stepExplanation: t("quickSort.advanceBoundary.stepExplanation", { i }),
        }, nodeId);
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
    18,
    t("quickSort.placePivot.statusTitle"),
    t("quickSort.placePivot.statusDetail", { high, pivotIndex: pivotFinalIndex }),
    t("quickSort.placePivot.stepExplanation", {
      pivotIndex: pivotFinalIndex,
      high,
    }),
  );

  ctx.sortedIndices.add(pivotFinalIndex);
  spawnPartitionChildren(ctx, low, high, pivotFinalIndex);

  pushStep(ctx, {
    subArrayRange: [low, high],
    pivotIndex: pivotFinalIndex,
    leftIndex: i,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 19,
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
  }, nodeId);

  return pivotFinalIndex;
}

function quickSortRange(
  ctx: StepContext,
  low: number,
  high: number,
): void {
  const t = getAlgorithmT();
  const nodeId = rangeId(low, high);
  ensureNode(ctx, low, high);

  if (low >= high) {
    if (low === high && low >= 0 && low < ctx.arr.length) {
      ctx.sortedIndices.add(low);
      const leaf = ctx.nodes.get(nodeId);
      if (leaf) {
        leaf.nodeHighlight = "done";
        leaf.cellHighlights = leaf.values.map(() => "sorted");
      }

      pushStep(ctx, {
        subArrayRange: [low, high],
        pivotIndex: low,
        leftIndex: null,
        rightIndex: null,
        comparingIdx: null,
        swapIndices: null,
        activeLine: 4,
        statusTitle: t("quickSort.baseCase.statusTitle"),
        statusDetail: t("quickSort.baseCase.statusDetail", { low }),
        stepExplanation: t("quickSort.baseCase.stepExplanation"),
      }, nodeId);
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
    activeLine: 5,
    statusTitle: t("quickSort.recursiveCall.statusTitle"),
    statusDetail: t("quickSort.recursiveCall.statusDetail", {
      low,
      high,
      count: high - low + 1,
    }),
    stepExplanation: t("quickSort.recursiveCall.stepExplanation", { low, high }),
  }, nodeId);

  const pivotIndex = partition(ctx, low, high);
  const leftHigh = pivotIndex - 1;
  const rightLow = pivotIndex + 1;

  if (low <= leftHigh) {
    const leftId = rangeId(low, leftHigh);
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
    }, leftId);

    quickSortRange(ctx, low, leftHigh);
  }

  if (rightLow <= high) {
    const rightId = rangeId(rightLow, high);
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
    }, rightId);

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
    nodes: new Map(),
    links: [],
    steps: [],
    pivotStrategy,
  };

  if (n === 0) {
    return ctx.steps;
  }

  if (n === 1) {
    ctx.sortedIndices.add(0);
    ensureNode(ctx, 0, 0);
    const single = ctx.nodes.get(rangeId(0, 0));
    if (single) {
      single.nodeHighlight = "done";
      single.cellHighlights = ["sorted"];
    }

    pushStep(ctx, {
      subArrayRange: [0, 0],
      pivotIndex: 0,
      leftIndex: null,
      rightIndex: null,
      comparingIdx: null,
      swapIndices: null,
      activeLine: 4,
      statusTitle: t("quickSort.singleElement.statusTitle"),
      statusDetail: t("quickSort.singleElement.statusDetail"),
      stepExplanation: t("quickSort.singleElement.stepExplanation"),
      isComplete: true,
    }, rangeId(0, 0));
    return ctx.steps;
  }

  ensureNode(ctx, 0, n - 1);

  pushStep(ctx, {
    subArrayRange: [0, n - 1],
    pivotIndex: null,
    leftIndex: null,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 3,
    statusTitle: t("quickSort.init.statusTitle"),
    statusDetail: t("quickSort.init.statusDetail", { n, strategy: pivotStrategy }),
    stepExplanation: initStepCopy(pivotStrategy, n),
  }, rangeId(0, n - 1));

  quickSortRange(ctx, 0, n - 1);

  for (let index = 0; index < n; index += 1) {
    ctx.sortedIndices.add(index);
  }

  for (const node of ctx.nodes.values()) {
    node.nodeHighlight = "done";
    node.cellHighlights = node.values.map(() => "sorted");
  }

  pushStep(ctx, {
    subArrayRange: [0, n - 1],
    pivotIndex: null,
    leftIndex: null,
    rightIndex: null,
    comparingIdx: null,
    swapIndices: null,
    activeLine: 4,
    statusTitle: t("quickSort.complete.statusTitle"),
    statusDetail: t("quickSort.complete.statusDetail"),
    stepExplanation: t("quickSort.complete.stepExplanation"),
    isComplete: true,
  }, null);

  return ctx.steps;
}

export function generateUnsortedArray(size: number): number[] {
  return generateRandomArray(size);
}
